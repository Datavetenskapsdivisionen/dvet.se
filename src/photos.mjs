import path from "path";
import { authorize } from "./googleApi.mjs";
import { google } from "googleapis";

const driveId = "0AGLrt0xH3PWfUk9PVA";
const listFiles = async (authClient) => {
    const drive = google.drive({ version: "v3", auth: authClient });
    const res = await drive.files.list({
        pageSize: 1000,
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
        if (c.mimeType != "application/vnd.google-apps.folder") {
            c.url = `https://drive.google.com/file/d/${c.id}/view`;
            c.previewUrl = `https://drive.google.com/file/d/${c.id}/preview`;
            c.directUrl = `https://drive.google.com/uc?id=${c.id}`;
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

    while (files.length != 0) {
        let node = files.pop();
        let [newRoot, foundRoot] = addNode(root, node);
        if (!foundRoot) {
            files = [node, ...files];
        }
        root = newRoot;
    }

    return root;
};

let photos = null;
const syncPhotos = async () => {
    if (process.env.ENABLE_DRIVE == "true")
        await authorize().then(async c => {
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