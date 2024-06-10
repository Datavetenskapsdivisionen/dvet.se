import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { decodeJwt } from "jose";
import { signToken } from "./auth.mjs";

// --------------- STUFF TO JUST GET THE API WORKING ---------------
// If modifying these scopes, delete token.json.
const SCOPES = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/calendar.readonly"
];
// The file token.json stores the user"s access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const getTokenFromGoogleOauth2 = async (req, res) => {
    const credentials = req.body.credential;
    try {
        const userData = decodeJwt(credentials);
        const user = {
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            organisation: userData.hd
        }
        const token = await signToken(user);
        res.cookie("dv-token", token, { maxAge: 1000*60*60*24*30 }); // Expires in 30 days (milliseconds)
        res.json({ token });
    } catch (err) {
        res.status(401).json({ msg: "Invalid credentials" });
    }
};

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
const loadSavedCredentialsIfExist = async () => {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
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
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
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
 * Load or request or authorization to call Google APIs.
 *
 */
const authoriseGoogleApi = async () => {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
};
if (process.env.ENABLE_DRIVE === "true") await authoriseGoogleApi();

export { authoriseGoogleApi, getTokenFromGoogleOauth2 };
