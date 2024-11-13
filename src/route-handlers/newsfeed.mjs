import RSS from "rss";
import { Octokit } from "octokit";
import { octokit, fetchName } from "../helpers/octokit.mjs";

const REFRESH_RATE = 2;
const MAX_FETCH = 100;
let posts = [];

const fetchPosts = async (options = { desc: true }) => {
    let page = 1;
    let allPosts = [];
    const { desc } = options;

    // GitHub's max limit is 100 issues per request
    while (true) {
        const response = await octokit.rest.issues.listForRepo({
            owner: "Datavetenskapsdivisionen",
            repo: "posts",
            per_page: MAX_FETCH,
            page: page,
            direction: desc ? "desc" : "asc",
            labels: "state:published,type:post"
        });

        const data = response.data.filter(e => (
            e.labels.find(l => l.name === "state:published") &&
            e.labels.find(l => l.name === "type:post")
        ));

        allPosts = allPosts.concat(data);
        page++;

        if (response.data.length < MAX_FETCH) break;
    }

    return allPosts;
};

let rss = "";
const fetchRSS = async () => {
    let feed = new RSS(
        {
            title: "DV Nyheter",
            feed_url: "https://www.dvet.se/newsfeed?type=rss",
            description: "Diverse nytt från Datavetenskap på GU",
            site_url: "https://dvet.se"
        });
    try {
        posts.forEach(e => {
            feed.item({
                title: e.title,
                description: e.body,
                url: "https://www.dvet.se/#post-" + e.id,
                guid: e.id,
                author: e.user.name,
                date: e.created_at
            });
        });

        rss = feed.xml({ indent: true });
    } catch { }
};

let lastTime = new Date(Date.parse("1970-01-01"));

const populateWithExtraData = async (post) => {
    post.user.full_name = await fetchName(post.user.login);
    if (post.reactions.total_count > 0) {
        const reactionsResponse = await octokit.rest.reactions.listForIssue({
            owner: "Datavetenskapsdivisionen",
            repo: "posts",
            issue_number: post.number
        });
        const reactionData = await Promise.all(reactionsResponse.data.map(async reaction => {
            const user = { ...reaction.user, full_name: await fetchName(reaction.user.login) };
            return { ...reaction, user };
        }));
        post.reactionData = reactionData;
    } else {
        post.reactionData = [];
    }

    return post;
}

const updatePosts = async () => {
    if (posts.length === 0) {
        posts = await fetchPosts({ desc: true });
        return;
    }

    const newPosts = await fetchPosts({ desc: false });
    await Promise.all(newPosts.map(async newPost => {
        const existingPostIndex = posts.findIndex(post => post.id === newPost.id);
        if (existingPostIndex !== -1) {
            if (posts[existingPostIndex].reactionData !== undefined) {
                newPost.user = posts[existingPostIndex].user;
                newPost.reactions = posts[existingPostIndex].reactions;
                newPost.reactionData = posts[existingPostIndex].reactionData;
            }
            posts[existingPostIndex] = newPost;
        } else {
            posts.push(newPost);
        }
    }));
}

const newsfeed = async (req, res) => {
    const diff = Math.abs(new Date() - lastTime);

    let pageSize = MAX_FETCH;
    let page = 1;
    if (req.query.num) {
        let num = parseInt(req.query.num);
        if (num != NaN) pageSize = num;
    }
    if (req.query.page) {
        let p = parseInt(req.query.page);
        if (p != NaN) page = p;
    }

    const minutes = (diff / 1000) / 60;
    if (minutes >= REFRESH_RATE) {
        lastTime = new Date();
        await updatePosts();
        await fetchRSS();
    }
    if (req.query.type == "rss") {
        res.set('Content-Type', 'text/xml');
        res.send(rss);
        return;
    } else {
        const startRange = (page-1)*pageSize;
        const endRange = pageSize+startRange;
        const currentPagePosts = posts.slice(startRange, endRange);

        if (currentPagePosts.length > 0 && currentPagePosts[0].reactionData !== undefined) {
            return res.json({ totalPostCount: posts.length, posts: currentPagePosts });
        }

        for (let i = 0; i < currentPagePosts.length; i++) {
            currentPagePosts[i] = await populateWithExtraData(currentPagePosts[i]);
        }

        posts.splice(startRange, pageSize, ...currentPagePosts);
        res.json({
            totalPostCount: posts.length,
            posts: currentPagePosts
        });
    }
};

const newsPostReact = async (req, res, isAdd) => {
    const { postId, reactionId } = req.params;
    const { reaction } = req.body;

    if (isAdd) {
        console.log("Adding reaction", reaction, "to post", postId);
    } else {
        console.log("Deleting reaction", reactionId, "from post", postId);
    }

    try {
        const o = "Datavetenskapsdivisionen";
        const r = "posts";
        const i = postId;
        const c = reaction;
        const id = reactionId;

        const postIndex = posts.findIndex(post => post.number === parseInt(postId));

        if (postIndex === -1) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userOctokit = new Octokit({ auth: req.cookies["dv-github-token"] });
        let response;
        if (isAdd) {
            response = await userOctokit.rest.reactions.createForIssue({ owner: o, repo: r, issue_number: i, content: c });
        } else {
            response = await userOctokit.rest.reactions.deleteForIssue({ owner: o, repo: r, issue_number: i, reaction_id: id });
        }
        
        if (response) {
            const updatedPost = await octokit.rest.issues.get({ owner: o, repo: r, issue_number: i });
            posts[postIndex] = await populateWithExtraData(updatedPost.data);
            res.status(200).json({ ok: true, post: posts[postIndex] });
        } else {
            res.status(204).json({});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addReaction = async (req, res) => {
    newsPostReact(req, res, true);
};

const deleteReaction = async (req, res) => {
    newsPostReact(req, res, false);
};

export { newsfeed, addReaction, deleteReaction };
