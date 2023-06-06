import { Octokit } from "octokit";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const fetchName = async (login) => {
    const res = await octokit.rest.users.getByUsername({ username: login });
    return res.data.name ? res.data.name : login;
};

export { octokit, fetchName };