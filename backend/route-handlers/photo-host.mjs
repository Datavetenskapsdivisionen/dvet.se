import fs from "fs";
import multer from "multer";
import sharp from "sharp";
import { decodeJwt } from "jose";

const allowedTypes = ["audio/aac", "image/bmp", "text/csv", "image/gif", "image/jpeg", "video/mp4",
    "video/mpeg", "audio/ogg", "video/ogg", "image/png", "application/pdf", "image/tiff",
    "text/plain", "audio/wav", "audio/webm", "video/webm", "image/webp", "image/heic"];
const upload = multer({
    dest: "frontend/dist/uploads/",
    limits: { fileSize: 10485760 },
    fileFilter: (req, file, cb) => cb(null, allowedTypes.includes(file.mimetype))
});

const uploadMedia = async (req, res, next) => {
    upload.array("files")(req, res, (err) => {
        if (err) { return res.status(400).json({ error: err.message + " (max file size is 10MB)" }); }
        next();
    });
};

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

const getUserFolder = (token) => {
    const decoded = decodeJwt(token);
    const user = decoded.email.split("@")[0];
    return `frontend/dist/uploads/${user}`;
}

const photoHostPost = async (req, res) => {
    const folder = getUserFolder(req.headers.authorization);

    let createDir = false;
    try {
        let folderInfo = fs.statSync(folder, {});
        createDir = !folderInfo.isDirectory();
    } catch (error) {
        createDir = true;
    }
    if (createDir) fs.mkdirSync(folder, { recursive: true });
    let filePaths = [];

    const fileTypesToCompress = ["image/jpeg", "image/png", "image/tiff", "image/webp", "image/heic"];
    for (const file of req.files) {
        const dotAt = file.originalname.lastIndexOf('.');
        const filename = [file.originalname.substring(0, dotAt), file.originalname.substring(dotAt)]; // [name, extension]
        const filePath = `${folder}/${filename[0].replaceAll(' ', '-')}_${file.filename}${filename[1]}`;
        if (fileTypesToCompress.includes(file.mimetype)) {
            const compressedFile = await compressImage(file, filePath);
            fs.writeFileSync(filePath, compressedFile);
        } else {
            fs.copyFileSync(file.path, filePath);
        }

        fs.unlinkSync(file.path);
        filePaths.push(filePath);
    }

    let filePathsLinks = "<ul>";
    filePaths.forEach(pathy => {
        let path = pathy.substring("frontend/dist/".length);
        filePathsLinks += `<li><a href="/${path}" target="_blank">https://dvet.se/${path}</a></li>`;
    });
    filePathsLinks += "</ul>";
    res.status(200).json({ ok: filePathsLinks, files: filePaths.map(f => f.substring(`${folder}/`.length)) });

};

const getFilesFromDir = async (dir) => {
    await fs.promises.access(dir);
    return fs.readdirSync(dir, (err, files) => files );
};

const getUserPhotos = async (req, res) => {
    const userFolder = getUserFolder(req.headers.authorization);
    try {
        const files = await getFilesFromDir(userFolder);
        res.status(200).json({ photos: files });
    } catch {
        res.status(200).json({ msg: "User does not own any photos." });
    }
};

const deleteUserPhoto = async (req, res) => {
    const hash = req.params.hash;
    if (!hash) {
        res.status(400).json({ msg: "No file was specified." });
        return;
    }

    const userFolder = getUserFolder(req.headers.authorization);
    try {
        const files = await getFilesFromDir(userFolder);
        for (const file of files) {
            const path = `${userFolder}/${file}`;
            if (file.includes(hash)) {
                fs.unlink(path, err => !err && res.status(200).json({ msg: "Photo has been deleted.", ok: true }));
                return;
            }
        }
        res.status(404).json({ msg: "Photo does not exist." });
    } catch {
        res.status(400).json({ msg: "User does not own any photos." });
    }
}

export { uploadMedia, photoHostPost, getUserPhotos, deleteUserPhoto };