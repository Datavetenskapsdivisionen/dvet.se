import path from "path";
import { authoriseGoogleApi } from "./googleApi.mjs";
import { google } from "googleapis";

const driveId = "0AGLrt0xH3PWfUk9PVA";
const listFiles = async (authClient) => {
    const drive = google.drive({ version: "v3", auth: authClient });
    const fetchFiles = async (pageToken) => {
        const res = await drive.files.list({
            pageSize: 1000,
            //pageSize: 50,
            corpora: "drive",
            driveId: driveId,
            includeItemsFromAllDrives: false,
            includeTeamDriveItems: true,
            supportsAllDrives: true,
            supportsTeamDrives: true,
            orderBy: "folder desc",
            fields: "nextPageToken, files(id, name, parents, mimeType, kind)",
            pageToken: pageToken
        });
        let files = res.data.files;
        if (res.data.nextPageToken) {
            files = files.concat(await fetchFiles(res.data.nextPageToken));
        }
        return files;
    };
    const result = await fetchFiles(null);
    return result;
};


// Yes this algorithm is horrible, but I can't be arsed 🤫
const buildTree = (files) => {
    let root = files.find(e =>
        e.mimeType == "application/vnd.google-apps.folder"
        && e.name == "Public"
        && e.parents[0] == [driveId]);
    root.children = [];
    files = files.filter(e => e.parents[0] != [driveId]);
    files = files.map(c => {
        c.children = [];
        c.childrenCount = 0;
        if (c.mimeType !== "application/vnd.google-apps.folder") {
            c.url = `https://drive.google.com/file/d/${c.id}/view`;
            c.previewUrl = `https://drive.google.com/file/d/${c.id}/preview`;
            c.directUrl = `https://drive.google.com/uc?id=${c.id}`;
            c.thumbnailUrl = `https://drive.google.com/thumbnail?id=${c.id}`;
        }
        return c;
    });

    const addNode = (root, node) => {
        let foundRoot = false;
        if (root.id == node.parents[0]) {
            root.children.push(node);
            foundRoot = true;
        } else {
            let newChildren = [];
            root.children.forEach(c => {
                let [newC, fnd] = addNode(c, node);
                newChildren.push(newC);
                foundRoot = foundRoot || fnd;
            });
            root.children = newChildren;
        }
        return [root, foundRoot];
    };

    const filterEmptyDirs = (root) => {
        if (root.mimeType === "application/vnd.google-apps.folder") {
            root.children = root.children.filter(n => !filterEmptyDirs(n));
            return root.children.length === 0;
        } else {
            return false;
        }
    };

    const countChildren = (root) => {
        if (root.mimeType !== "application/vnd.google-apps.folder") {
            return 1;
        }

        root.children.map(n => root.childrenCount += countChildren(n));
        return root.children.length;
    };

    let lastLen = files.length;
    let borkCounter = 0;
    while (files.length != 0) {
        let node = files.pop();
        let [newRoot, foundRoot] = addNode(root, node);
        if (!foundRoot) {
            files = [node, ...files];
        } else {
            borkCounter = 0;
        }
        if (lastLen == files.length) {
            borkCounter += 1;
            if (borkCounter >= lastLen) {
                break;
            }
        }
        lastLen = files.length;
        root = newRoot;
    }

    filterEmptyDirs(root);
    countChildren(root);

    return root;
};

let photos = null;
const syncPhotos = async () => {
    if (process.env.ENABLE_DRIVE == "true")
        await authoriseGoogleApi().then(async c => {
            photos = await buildTree(await listFiles(c));
        }).catch(console.error);
};

let lastTime = Number.MAX_VALUE;
const getPhotos = async (req, res) => {
    if (process.env.ENABLE_DRIVE != "true") {
        res.json({ error: "Image API is down!" });
        return;
    }

    const diff = Math.abs(new Date() - lastTime);
    const minutes = (diff / 1000) / 60;
    if (minutes >= 5) {
        lastTime = new Date();
        syncPhotos().then(() => res.json(photos));
    } else res.json(photos);
};

export default getPhotos;