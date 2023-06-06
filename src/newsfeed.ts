import RSS from "rss";
import { octokit, fetchName } from "./octokit";
import { Request, Response } from "express";
import { Endpoints } from "@octokit/types";

type ListIssuesForRepos = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];
type Issue = ListIssuesForRepos["data"][0];
type Label = ListIssuesForRepos["data"][0]["labels"][0];

interface Posts {
    kind: "posts";
    posts: Issue[];
}
interface Error {
    kind: "error";
    error: any;
}
type PostData = Posts | Error;

let posts: PostData = { kind: "posts", posts: [] };
const fetchPosts = async () => {
    const onSuccess = async (r: ListIssuesForRepos) => {
        const data = r.data.filter((e: Issue) => (
            e.labels.filter(
                (e: Label) =>
                    (typeof e !== "string") ?
                        e.name == "state:published" || e.name == "type:post"
                        : false
            ).length == 2
            && e.state == "open"
        ));

        // I want to switch away from any here but I can't be bothered
        await Promise.all(data.map(async (e: any) => {
            if (e.reactions) {
                e.reactions = Object.entries(e.reactions)
                    .filter(([e, _]) => e != "url" && e != "total_count");
            }
            e.user.name = await fetchName(e.user.login);
        }));
        posts = { kind: "posts", posts: data };
    };

    await octokit.rest.issues.listForRepo({
        owner: "Datavetenskapsdivisionen",
        repo: "posts",
        per_page: 100,
    })
        .then(onSuccess)
        .catch(e => posts = { kind: "error", error: e });
};
/*await*/ fetchPosts();

let rss = "";
const fetchRSS = async () => {
    let feed = new RSS(
        {
            title: "DV Nyheter",
            feed_url: "https://dvet.se/newsfeed?type=rss",
            description: "Diverse nytt från Datavetenskap på GU",
            site_url: "https://dvet.se"
        });
    if (posts.kind === "error") {
        feed.item({
            title: "Error",
            description: JSON.stringify(posts.error),
            url: "https://dvet.se/",
            guid: "0",
            author: "Error",
            date: "1970-01-01"
        });
    } else {
        posts.posts.forEach(e => {
            feed.item({
                title: e.title,
                description: e.body ? e.body : "",
                url: "https://dvet.se/#post-" + e.id,
                guid: e.id ? `${e.id}` : "-1",
                author: e.user ? (e.user.name ? e.user.name : "unknown") : "unknown",
                date: e.created_at
            });
        });
    }

    rss = feed.xml({ indent: true });
};
/*await*/ fetchRSS();

let lastTime = new Date();

const newsFeed = async (req: Request, res: Response) => {
    const diff = Math.abs(new Date().getTime() - lastTime.getTime());
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

export { newsFeed, PostData, Error, Posts };
