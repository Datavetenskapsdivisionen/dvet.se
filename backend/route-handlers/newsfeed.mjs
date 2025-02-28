import RSS from "rss";
import { Octokit } from "octokit";
import { octokit, fetchName } from "../helpers/octokit.mjs";

const REFRESH_RATE = 2;
const MAX_FETCH = 100;
let posts = [];
let loginFullNames = {};

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
        
        if (!response.data) { return []; }

        // Filter out posts that are not published
        const publishedPosts = response.data.filter(e => (
            e.labels.find(l => l.name === "state:published") &&
            e.labels.find(l => l.name === "type:post")
        ));

        const commentsRes = await octokit.rest.issues.listCommentsForRepo({
            owner: "Datavetenskapsdivisionen",
            repo: "posts",
            per_page: MAX_FETCH,
            page: page
        });

        if (commentsRes.data) {
            publishedPosts.forEach(post => {
                post.commentsData = commentsRes.data.filter(c => c.issue_url === post.url);
            });
        }

        allPosts = allPosts.concat(publishedPosts);
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
            feed_url: "https://www.dvet.se/api/newsfeed?type=rss",
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
    if (!post.user || !post.reactions || !post.number || post.comments === undefined) { console.log(post); return post; }

    const addFullName = async (user) => {
        if (!loginFullNames[user.login]) {
            user.full_name = await fetchName(user.login);
            loginFullNames[user.login] = user.full_name;
        } else {
            user.full_name = loginFullNames[user.login];
        }
    }

    try {
        addFullName(post.user);
        
        // Add reactions data
        if (post.reactions.total_count > 0) {
            const reactionsResponse = await octokit.rest.reactions.listForIssue({
                owner: "Datavetenskapsdivisionen",
                repo: "posts",
                issue_number: post.number
            });
            post.reactionData = reactionsResponse.data;
            for (let reaction of post.reactionData) {
                addFullName(reaction.user);
            }
        } else {
            post.reactionData = [];
        }

        // Add comments data
        if (post.comments > 0) {
            const commentRes = await octokit.rest.issues.listComments({
                owner: "Datavetenskapsdivisionen",
                repo: "posts",
                issue_number: post.number
            });
            post.commentsData = commentRes.data;
            for (let comment of post.commentsData) {
                addFullName(comment.user);
            }
        } else {
            post.commentsData = [];
        }
    } catch (e) {
        console.log(e);
        post.user.full_name = post.user.login;
        post.reactionData = [];
        post.commentsData = [];
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
    if (!process.env.GITHUB_TOKEN) {
        const rateLimit = await octokit.request("GET /rate_limit");
        const core = rateLimit.data.resources.core;
        if (core.remaining <= 0) {
            return res.status(429).json({ rateLimited: true, reset: core.reset, posts: [], totalPostCount: 0 });
        }
    }

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
            if (!updatedPost.data) { return res.status(204).json({}); }
            
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

const newsPostComment = async (req, res, method) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    try {
        const o = "Datavetenskapsdivisionen";
        const r = "posts";
        const i = postId;
        const c = comment;
        const id = commentId;

        const postIndex = posts.findIndex(post => post.number === parseInt(postId));

        if (postIndex === -1) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userOctokit = new Octokit({ auth: req.cookies["dv-github-token"] });
        let response;
        switch (method) {
            case "add":    response = await userOctokit.rest.issues.createComment({ owner: o, repo: r, issue_number: i, body: c }); break;
            case "edit":   response = await userOctokit.rest.issues.updateComment({ owner: o, repo: r, comment_id: id,  body: c }); break;
            case "delete": response = await userOctokit.rest.issues.deleteComment({ owner: o, repo: r, comment_id: id }); break;
            default: throw new Error("Invalid method");
        }
        
        if (response) {
            const updatedPost = await octokit.rest.issues.get({ owner: o, repo: r, issue_number: i });
            if (!updatedPost.data) { return res.status(204).json({}); }

            posts[postIndex] = await populateWithExtraData(updatedPost.data);
            res.status(200).json({ ok: true, post: posts[postIndex] });
        } else {
            res.status(204).json({});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addComment = async (req, res) => {
    newsPostComment(req, res, "add");
};

const editComment = async (req, res) => {
    newsPostComment(req, res, "edit");
};

const deleteComment = async (req, res) => {
    newsPostComment(req, res, "delete");
};

export { newsfeed, addReaction, deleteReaction, addComment, editComment, deleteComment };
