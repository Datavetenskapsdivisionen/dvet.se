import fs from "fs";
import { decodeJwt } from "jose";
import sharp from "sharp";

const compressImage = async (file, to_path) => {
    const image = sharp(file.path);
    const metadata = await image.metadata();
    let buffer = await image.toBuffer();
    if (metadata.width > 1000 || metadata.height > 1000) {
        const ratio = metadata.width / metadata.height;
        let w, h;
        if (metadata.width >= metadata.height) {
            w = 1000;
            h = Math.floor(1000 / ratio);
        } else {
            w = Math.floor(1000 * ratio);
            h = 1000;
        }
        const resizedImage = image.resize({ width: w, height: h });
        buffer = await resizedImage.toBuffer();
    }

    if (buffer.length > 512000) {
        let quality = 90;
        while (quality > 40) {
            switch (metadata.format) {
                case "jpeg": image.jpeg({ quality }); break;
                case "png": image.png({ quality }); break;
                case "tiff": image.tiff({ quality }); break;
                case "webp": image.webp({ quality }); break;
                case "heif": image.heif({ quality }); break;
                default: return buffer;
            }
            buffer = await image.toBuffer();
            quality -= 5;
            if (buffer.length < 512000) break;
        }
    }

    return buffer;
};

const photoHostPost = async (req, res) => {
    if (req.body.folder == null || req.body.folder.includes("..") || req.body.folder.startsWith("/")) {
        res.status(401).json({ err: `invalid :(` });
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });
        return;
    }
    const token = req.headers.authorization;
    const decoded = decodeJwt(token);
    const user = decoded.name.replace('.', '');

    let folder = `dist/uploads/${req.body.folder}`;
    let createDir = false;
    try {
        let folderInfo = fs.statSync(folder, {});
        createDir = !folderInfo.isDirectory();
    } catch (error) {
        createDir = true;
    }
    if (createDir) fs.mkdirSync(folder, { recursive: true });
    let newPaths = [];

    const fileTypesToCompress = ["image/jpeg", "image/png", "image/tiff", "image/webp", "image/heic"];
    for (const file of req.files) {
        const newPath = `${folder.endsWith("/") ? folder : `${folder}/`}${user} - ${file.filename} - ${file.originalname}`;
        if (fileTypesToCompress.includes(file.mimetype)) {
            const compressedFile = await compressImage(file, newPath);
            fs.writeFileSync(newPath, compressedFile);
        } else {
            fs.copyFileSync(file.path, newPath);
        }

        fs.unlinkSync(file.path);
        newPaths.push(newPath);
    }

    let newPathsLinks = "<ul>";
    newPaths.forEach(pathy => {
        let path = pathy.substring(5);
        newPathsLinks += `<li><a href="/${path}" target="_blank">https://dvet.se/${path}</a></li>`;
    });
    newPathsLinks += "</ul>";
    res.status(200).json({ ok: `Your uploaded files can be accessed from: ${newPathsLinks}` });

};

export { photoHostPost };