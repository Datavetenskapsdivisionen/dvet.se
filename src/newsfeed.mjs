import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const fetchName = async (login) => {
    const res = await octokit.rest.users.getByUsername({ username: login });
    return res.data.name ? res.data.name : login;
};

let posts = {};
const fetchPosts = async () => {
    const onSuccess = (r) => {
        const data = r.data.filter(e => (
            e.labels.filter(e => e.name == "state:published" || e.name == "type:post").length == 2
            && e.state == "open"
        ));

        data.forEach(async e => {
            e.reactions = Object.entries(e.reactions)
                .filter(([e, _]) => e != "url" && e != "total_count");
            e.user.name = await fetchName(e.user.login);
        });
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

let lastTime = new Date();

const me = async (req, res) => {
    if (req.query.post) {
        res.json({ na: req.query.post });
    } else {
        const diff = Math.abs(new Date() - lastTime);
        const minutes = (diff / 1000) / 60;
        if (minutes >= 1) {
            lastTime = new Date();
            await fetchPosts();
        }
        res.json(posts);
    }
};

export default me;
