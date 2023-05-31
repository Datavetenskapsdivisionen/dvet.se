import { GithubBlog } from "@rena.to/github-blog";

const blog = new GithubBlog({
    repo: "Datavetenskapsdivisionen/posts",
    token: process.env.GITHUB_TOKEN,
});
let posts = await blog.getPosts({
    query: { type: "post", state: "published" },
    pager: { limit: 10, offset: 0 },
});

let lastTime = new Date();

const me = async (req, res) => {
    const diff = Math.abs(new Date() - lastTime);
    const minutes = (diff / 1000) / 60;
    if (minutes >= 1) {
        lastTime = new Date();
        posts = await blog.getPosts({
            query: { type: "post", state: "published" },
            pager: { limit: 10, offset: 0 },
        });
    }
    posts.lastTime = minutes;
    res.json(posts);
    //res.json(posts);
};

export default me;
