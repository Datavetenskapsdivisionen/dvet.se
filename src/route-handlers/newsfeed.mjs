import RSS from "rss";
import { octokit, fetchName } from "../helpers/octokit.mjs";

const MAX_FETCH = 100;
let posts = [];
const fetchPosts = async () => {
    const onSuccess = async (r) => {
        const data = r.data.filter(e => (
            e.labels.filter(e => e.name == "state:published" || e.name == "type:post").length == 2
            && e.state == "open"
        ));

        await Promise.all(data.map(async e => {
            e.reactions = Object.entries(e.reactions)
                .filter(([e, _]) => e != "url" && e != "total_count");
            e.user.name = await fetchName(e.user.login);
        }));
        posts = data;
    };

    return await
        octokit.rest.issues.listForRepo(
            {
                owner: "Datavetenskapsdivisionen",
                repo: "posts",
                per_page: MAX_FETCH,
            })
            .then(onSuccess)
            .catch(e => posts = { error: e });
};
await fetchPosts();

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
await fetchRSS();

let lastTime = new Date(Date.parse("1970-01-01"));

const newsfeed = async (req, res) => {
    const diff = Math.abs(new Date() - lastTime);

    let amount = MAX_FETCH;
    if (req.query.num) {
        let res = parseInt(req.query.num, 10);
        if (res != NaN) amount = res;
    }

    const minutes = (diff / 1000) / 60;
    if (minutes >= 1) {
        lastTime = new Date();
        await fetchPosts();
        await fetchRSS();
    }
    if (req.query.type == "rss") {
        res.set('Content-Type', 'text/xml');
        res.send(rss);
    } else {
        if (posts.slice)
            res.json(posts.slice(0, amount));
        else
            res.json([]);
    }
};

export { newsfeed };
