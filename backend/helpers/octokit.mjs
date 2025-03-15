import { Octokit } from "octokit";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const fetchName = async (login) => {
    const res = await octokit.rest.users.getByUsername({ username: login });
    return res.data.name ? res.data.name : login;
};

const fetchRepoTree = async (owner, repo, branch, path = "") => {
    const res = await octokit.rest.repos.getBranch({
        owner: owner,
        repo: repo,
        branch: branch,
    });

    const sha = res.data.commit.sha;
    const tree = await octokit.rest.git.getTree({
        owner: owner,
        repo: repo,
        tree_sha: sha,
        recursive: true,
    });

    return tree.data.tree.filter((item) => item.path.startsWith(path));
};

const fetchBlobData = async (owner, repo, sha) => {
    const res = await octokit.rest.git.getBlob({
        owner: owner,
        repo: repo,
        file_sha: sha,
    });

    return res.data;
};

export { octokit, fetchName, fetchRepoTree, fetchBlobData };