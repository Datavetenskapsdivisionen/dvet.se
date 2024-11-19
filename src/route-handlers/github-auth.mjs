import { Octokit } from "octokit";
import jwt from 'jsonwebtoken';

let redirectUri;

const isAuthWithGithub = async (req, res) => {
    if (req.cookies["dv-github-token"]) {
        return res.status(200).json({ authenticated: true });
    }
    return res.status(200).json({ authenticated: false });
};

const githubLogin = async (req, res) => {
    const isLocalhost = !req.hostname.includes("dvet");
    const port = process.env.PORT || 8080;
    const clientId = isLocalhost ? process.env.GITHUB_DEV_APP_CLIENT_ID : process.env.GITHUB_APP_CLIENT_ID;
    redirectUri = `${isLocalhost ? ("http://localhost:"+port) : "https://dvet.se"}/github-auth/authorised`;
    res.status(302).redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`);
};

const githubCallback = async (req, res, next) => {
    const isLocalhost = !req.hostname.includes("dvet");
    const code = req.query.code;
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: isLocalhost ? process.env.GITHUB_DEV_APP_CLIENT_ID : process.env.GITHUB_APP_CLIENT_ID,
            client_secret: isLocalhost ? process.env.GITHUB_DEV_APP_SECRET : process.env.GITHUB_APP_SECRET,
            code: code,
            redirect_uri: redirectUri,
        }),
    });

    if (!tokenResponse.ok) {
        console.log(tokenResponse);
        return res.status(401).send("Unable to authenticate with GitHub.");
    }

    const tokenResponseJson = await tokenResponse.json();
    const accessToken = tokenResponseJson.access_token;
    
    const octokit = new Octokit({ auth: accessToken });
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const userJwt = jwt.sign(user, process.env.JWT_SECRET_KEY);
    res.cookie("dv-github-user", userJwt);
    res.cookie("dv-github-token", accessToken, { httpOnly: true, secure: true });
    next();
};

export { isAuthWithGithub, githubLogin, githubCallback };