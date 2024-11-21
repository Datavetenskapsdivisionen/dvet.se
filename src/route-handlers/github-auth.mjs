import { Octokit } from "octokit";
import jwt from 'jsonwebtoken';

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV;
const redirectUri = nodeEnv === 'development'
    ? `http://localhost:${port}/github-auth/authorised?lang=en`
    : `https://www.dvet.se/github-auth/authorised?lang=en`;

const isAuthWithGithub = async (req, res) => {
    if (req.cookies["dv-github-token"]) {
        return res.status(200).json({ authenticated: true });
    }
    return res.status(200).json({ authenticated: false });
};

const githubLogin = async (req, res) => {
    const clientId = process.env.GITHUB_APP_CLIENT_ID;    
    res.status(302).redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`);
};

const githubCallback = async (req, res, next) => {
    const code = req.query.code;
    if (!code) { return next(); }
    
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_APP_CLIENT_ID,
            client_secret: process.env.GITHUB_APP_SECRET,
            code: code,
            redirect_uri: redirectUri,
        }),
    });

    const tokenResponseJson = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenResponseJson.access_token) {
        console.log(tokenResponse);
        return res.status(401).send("Unable to authenticate with GitHub.");
    }

    try {
        const accessToken = tokenResponseJson.access_token;
        const octokit = new Octokit({ auth: accessToken });
        const { data: user } = await octokit.rest.users.getAuthenticated();

        const userJwt = jwt.sign(user, process.env.JWT_SECRET_KEY);
        res.cookie("dv-github-user", userJwt);
        res.cookie("dv-github-token", accessToken, { httpOnly: true, secure: true });
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send("Unable to authenticate with GitHub");\
    }
};

export { isAuthWithGithub, githubLogin, githubCallback };