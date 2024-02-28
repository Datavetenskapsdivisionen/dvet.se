import fs from "fs";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

let photoPosters = {};

fs.readFile("./photoPosters.json", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        fs.writeFileSync("./photoPosters.json", JSON.stringify(photoPosters));
        return;
    }
    photoPosters = JSON.parse(data);
});

let tempKey;
const addUser = (req, res) => {
    let user = req.query.user;
    if (!user || photoPosters[user]) {
        res.send("invalid :(");
        return;
    }
    if (Object.values(photoPosters).length == 0) {
        tempKey = speakeasy.generateSecret({
            length: 32, step: 120,
            name: "DVET Image Posting - " + user
        });
        qrcode.toDataURL(tempKey.otpauth_url, (err, data_url) => {
            res.send('<img src="' + data_url + '">');
        });
        photoPosters[user] = tempKey;
        fs.writeFileSync("./photoPosters.json", JSON.stringify(photoPosters));
        tempKey = null;
    } else {
        let code = req.query.code;
        let authUser = isValidUser(code);
        if (!authUser) {
            res.send("invalid :(");
            return;
        }
        tempKey = speakeasy.generateSecret({
            length: 32, step: 120,
            name: "DVET Image Posting - " + user
        });
        qrcode.toDataURL(tempKey.otpauth_url, (err, data_url) => {
            res.send('<img src="' + data_url + '">');
        });
        photoPosters[user] = tempKey;
        photoPosters[user].authUser = authUser;
        fs.writeFileSync("./photoPosters.json", JSON.stringify(photoPosters));
        tempKey = null;
    }
};

const isValidUser = (code) => {
    if (!code) return;
    for (const [user, secret] of Object.entries(photoPosters)) {
        let realCode = speakeasy.totp({ secret: secret.ascii, encoding: "ascii" });
        if (code == realCode) return user;
    }
    return;
};

const testCode = (req, res) => {
    let user = isValidUser(req.query.code);
    if (user) res.send("Authenticated as " + user);
    else res.send("Failed to validate as any user");
};

const photoHostGet = (req, res) => {
    res.send(`
        <form action="/photos/photoHostPost" method="post" enctype="multipart/form-data">
            <label for="authcode">Authcode:</label>
            <input type="text" id="authcode" name="authcode"><br><br>
            <label for="folder">Folder:</label>
            <input type="text" id="folder" name="folder"><br><br>
            <label for="files">Select files:</label>
            <input type="file" id="files" name="files" multiple accept="image/png, image/gif, image/jpeg"><br><br>
            <input type="submit">
        </form>
    `);
};
const photoHostPost = async (req, res) => {
    let user = isValidUser(req.body.authcode);
    if (!user || req.body.folder.contains("../")) {
        res.send("invalid :(");
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });
        return;
    }

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
    let newPathsLinks = "<ul>";
    newPaths.forEach(pathy => {
        let path = pathy.substring(5);
        newPathsLinks += `<li><a href="/${path}">https://dvet.se/${path}</a></li>`;
    });
    newPathsLinks += "</ul>";
    res.send(`Your uploaded files can be accessed from: ${newPathsLinks}`);
};

export { photoHostGet, photoHostPost, addUser, testCode, isValidUser };