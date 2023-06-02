import RSS from "rss";
import { octokit, fetchName } from "./octokit.mjs";

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
                per_page: 100,
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
            feed_url: "https://dvet.se/newsfeed?type=rss",
            description: "Diverse nytt från Datavetenskap på GU",
            site_url: "https://dvet.se"
        });
    posts.forEach(e => {
        feed.item({
            title: e.title,
            description: e.body,
            url: "https://dvet.se/#post-" + e.id,
            guid: e.id,
            author: e.user.name,
            date: e.created_at
        });
    });

    rss = feed.xml({ indent: true });
};
await fetchRSS();

let lastTime = new Date();

const newsfeed = async (req, res) => {
    const diff = Math.abs(new Date() - lastTime);
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
        res.json(posts);
    }
};

export { newsfeed };
