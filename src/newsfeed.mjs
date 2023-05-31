import { GithubBlog } from "@rena.to/github-blog";

const blog = new GithubBlog({
    repo: "Datavetenskapsdivisionen/posts",
    token: process.env.GITHUB_TOKEN,
});
const fetchPosts = async () => await blog.getPosts({
    query: { type: "post", state: "published" },
    pager: { limit: 20, offset: 0 },
});
let posts = await fetchPosts();

//const fetchPostData = async (post) => await blog.getPost();

let lastTime = new Date();

const me = async (req, res) => {
    if (req.query.post) {
        const url = blog.client.url;
        const headers = new Headers({
            "Authorization": "Bearer " + process.env.GITHUB_TOKEN,
            "Accept": "application/vnd.github+json"
        });
        const result = await fetch("https://api.github.com/repos/Datavetenskapsdivisionen/posts/issues/1", {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .catch(e => "ouch");
        res.json({ res: result, url: url });
    } else {
        const diff = Math.abs(new Date() - lastTime);
        const minutes = (diff / 1000) / 60;
        if (minutes >= 1) {
            lastTime = new Date();
            posts = await fetchPosts();
        }
        posts.lastTime = minutes;
        res.json(posts);
    }
};

export default me;
