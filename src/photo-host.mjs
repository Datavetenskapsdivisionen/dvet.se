import fs from "fs";
import { decodeJwt } from "jose";

const photoHostPost = async (req, res) => {
    if (req.body.folder == null || req.body.folder.includes("../") || req.body.folder.startsWith("/")) {
        console.log(req.folder);
        res.status(401).json({ err: `invalid :(` });
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });
        return;
    }
    const token = req.headers.authorization;
    const decoded = decodeJwt(token);
    const user = decoded.name;

    let folder = `dist/uploads/${req.body.folder}`;
    let createDir = false;
    try {
        let folderInfo = fs.statSync(folder, {});
        if (!folderInfo.isDirectory()) {
            createDir = true;
        }
    } catch (error) {
        createDir = true;
    }
    if (createDir) fs.mkdirSync(folder, { recursive: true });
    let newPaths = [];
    req.files.forEach(file => {
        let newPath = `${folder.endsWith("/") ? folder : `${folder}/`}${user} - ${file.filename} - ${file.originalname}`;
        fs.copyFileSync(file.path, newPath);
        fs.unlinkSync(file.path);
        newPaths.push(newPath);
    });
    let newPathsLinks = "";
    newPaths.forEach(pathy => {
        let path = pathy.substring(5);
        newPathsLinks = `<a href="/${path}">https://dvet.se/${path}</a>`;
    });
    res.status(200).json({ ok: `Your uploaded files can be accessed from: ${newPathsLinks}` });
};

export { photoHostPost };