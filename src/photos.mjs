import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";


// --------------- STUFF TO JUST GET THE API WORKING ---------------
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly"];
// The file token.json stores the user"s access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

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
 * Load or request or authorization to call APIs.
 *
 */
const authorize = async () => {
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

// --------------- STUFF TO JUST GET THE API WORKING ---------------
const driveId = "0AGLrt0xH3PWfUk9PVA";
const listFiles = async (authClient) => {
    const drive = google.drive({ version: "v3", auth: authClient });
    const res = await drive.files.list({
        //pageSize: 10,
        corpora: "drive",
        driveId: driveId,
        includeItemsFromAllDrives: false,
        includeTeamDriveItems: true,
        supportsAllDrives: true,
        supportsTeamDrives: true,
        fields: "nextPageToken, files(id, name, parents, mimeType, kind)",
    });
    const files = res.data.files;
    return files;
};

const buildTree = async (files) => {
    const root = files.find(e =>
        e.mimeType == "application/vnd.google-apps.folder"
        && e.name == "Public"
        && e.parents[0] == [driveId]);
    root.children = [];
    files = files.filter(e => e.parents[0] != [driveId]);

    const iter = (root, files) => {
        const rest = [];
        files.forEach(e => {
            if (e.mimeType == "application/vnd.google-apps.folder") {
                e.children = [];
            } else {
                e.url = `https://drive.google.com/file/d/${e.id}/view`;
                e.previewUrl = `https://drive.google.com/file/d/${e.id}/preview`;
                e.directUrl = `https://drive.google.com/uc?id=${e.id}`;
            }
            // else if (e.mimeType.startsWith("image/")) {
            //     drive.files.get({
            //         fileId: e.id,
            //         supportsAllDrives: true,
            //     }).then(c => console.log("---------------------\n" + JSON.stringify(c) + "\n---------------------"));
            //     //console.log(res);
            // }
            if (e.parents[0] == root.id)
                root.children.push(e);
            else
                rest.push(e);
        });
        files = rest;

        root.children = root.children
            .sort((a, b) => a.mimeType == "application/vnd.google-apps.folder" ? -1 : 1);

        root.children.forEach(c => {
            if (c.children)
                iter(c, files);
        });
    };

    iter(root, files);
    return root;
};

let photos = null;
const syncPhotos = () => {
    if (process.env.ENABLE_DRIVE == "true")
        authorize().then(async c => {
            photos = await buildTree(await listFiles(c));
        }).catch(console.error);
};
await syncPhotos();

let lastTime = new Date();
const getPhotos = async (req, res) => {
    if (process.env.ENABLE_DRIVE != "true") {
        res.json({ error: "Image API is down!" });
        return;
    }

    const diff = Math.abs(new Date() - lastTime);
    const minutes = (diff / 1000) / 60;
    if (minutes >= 0) {
        lastTime = new Date();
        await syncPhotos();
    }
    res.json(photos);
};

export default getPhotos;