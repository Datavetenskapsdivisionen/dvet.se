import fs from "fs/promises";
import path from "path";
import process from "process";
import http from "http";
import url from "url";
import open from "open";
import destroyer from "server-destroy";
import chalk from "chalk";
import { google } from "googleapis";            
import { OAuth2Client } from "google-auth-library";
import { decodeJwt } from "jose";
import { signToken } from "./auth.mjs";

// --------------- STUFF TO JUST GET THE API WORKING ---------------
// README: If modifying these scopes, delete token.json.
const SCOPES = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/admin.directory.user.readonly",
    "https://www.googleapis.com/auth/admin.directory.group.readonly"
];
// The file token.json stores the user"s access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "backend/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "backend/credentials.json");

const googleLogin = async (req, res) => {
    if (process.env.ENABLE_DRIVE !== "true") {
        return res.status(503).json({ error: "Google API is down!", driveDisabled: true });
    }

    const googleLoginJwt = req.body.credential;
    if (!googleLoginJwt) {
        res.status(401).json({ msg: "No credentials provided" });
        return;
    }

    let user;
    try {
        const userData = decodeJwt(googleLoginJwt);
        user = {
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            organisation: userData.hd,
        }
    } catch (err) {
        res.status(401).json({ msg: "Invalid credentials" });
        console.error(err);
        return;
    }

    const userGroups = await fetchUserGroups(user.email);
    user = {...user, userGroups };

    const jwt = await signToken(user);
    res.cookie("dv-token", jwt, { maxAge: 1000*60*60*24*30 }); // Expires in 30 days (milliseconds)
    res.status(200).json({ jwt });
};

const fetchUserGroups = async (email) => {
    try {
        const oAuth2Client = await authoriseGoogleApi();
        const admin = google.admin({version: "directory_v1", auth: oAuth2Client});
        return (await admin.groups.list({userKey: email})).data.groups;
    } catch (err) {
        console.error(err);
        return [];
    }
};

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
const loadSavedCredentialsIfExist = async () => {
    const credentialsExists = fs.access(TOKEN_PATH, fs.constants.F_OK).then(() => true).catch(() => false);
    if (!credentialsExists) {
        return null;
    }

    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        const oAuth2Client = google.auth.fromJSON(credentials);
        return oAuth2Client;
    } catch (err) {
        console.log(chalk.red("Error loading credentials:"), err);
        return null;
    }
};

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
const saveCredentials = async (client) => {
    const keys = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
};

/**
* Create a new OAuth2Client, and go through the OAuth2 content workflow.
* 
* @returns {Promise<OAuth2Client>} the full client to the callback.
*/
const getAuthenticatedClient = async () => {
    return new Promise(async (resolve, reject) => {
        const keys = JSON.parse(await fs.readFile(CREDENTIALS_PATH));   
        // create an oAuth client to authorize the API call.
        const oAuth2Client = new OAuth2Client(
            keys.web.client_id,
            keys.web.client_secret,
            keys.web.redirect_uris[0]
        );
  
        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: SCOPES,
        });
  
        // Open a temporary http server to accept the oauth callback.
        const server = http.createServer(async (req, res) => {
            try {
                // Acquire the code from the querystring and close the web server.
                const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                const code = qs.get('code');
                console.log(`Code is ${code}`);
                res.end('Authentication successful! Please return to the console.');
                server.destroy();
    
                // Retrieve and set the credentials on the OAuth2 client.
                const r = await oAuth2Client.getToken(code);
                oAuth2Client.setCredentials(r.tokens);
                console.info('Tokens acquired.');
                resolve(oAuth2Client);
            } catch (e) {
                reject(e);
            }
        }).listen(3000, () => {
            console.log(chalk.yellow("Launching browser... Click the link below if nothing happened:") + `\n${chalk.blue(authorizeUrl)}\n`);
            // open the browser to the authorize url to start the workflow
            open(authorizeUrl, {wait: false}).then(cp => cp.unref());
        });
        destroyer(server);
    });
};

/**
 * Load or request or authorization to call Google APIs.
 *
 * @return {Promise<OAuth2Client>}
 */
const authoriseGoogleApi = async () => {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }

    console.log(chalk.red("Credentials not found. Fetching new client..."));
    client = await getAuthenticatedClient();
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
};
if (process.env.ENABLE_DRIVE === "true") await authoriseGoogleApi();

export { authoriseGoogleApi, googleLogin, fetchUserGroups };
