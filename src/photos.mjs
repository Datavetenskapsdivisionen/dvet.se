import path from "path";
import { authorize } from "./googleApi.mjs";
import { google } from "googleapis";

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
        orderBy: "createdTime desc",
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
    if (minutes >= 5) {
        lastTime = new Date();
        await syncPhotos();
    }
    res.json(photos);
};

export default getPhotos;