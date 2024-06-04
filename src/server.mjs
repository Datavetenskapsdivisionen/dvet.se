import express from "express";
import path from "path";
import expressStaticGzip from "express-static-gzip";
import { fileURLToPath } from "url";
import "dotenv/config";
import multer from "multer";

const upload = multer({ dest: "dist/uploads/", limits: { fileSize: 10485760 } });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const callback = (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
};

import { newsfeed } from "./newsfeed.mjs";
import { postHook } from "./githookhandle.mjs";
import getPhotos from "./photos.mjs";
import { getSlides, updateSlides } from "./info-screen.mjs";
import { getKickOffEvents, getDVEvents } from "./events.mjs";
import killerBean from "./killerbean.mjs";
import { addUser, testCode, photoHostGet, photoHostPost } from "./photo-host.mjs";

app.use(expressStaticGzip("dist", {
    serveStatic: { maxAge: 60 * 1000 }
}));
app.use(express.json());
[
    "/",
    "/committees",
    "/info-screen",
    "/info-screen/edit",
    "/newsscreen",
    "/scscreen",
    "/about",
    "/documents",
    "/contact",
    "/tools",
    "/photos",
    "/schedule",
    "/dviki",
    "/committees/the-board",
    "/committees/dvrk",
    "/committees/dvrk/schedule",
    "/committees/dvrk/schedule/bachelor",
    "/committees/dvrk/schedule/master",
    "/committees/dvrk/contact",
    "/committees/dvrk/form",
    "/committees/board-of-studies",
    "/committees/mega6",
    "/committees/concats",
    "/committees/femmepp",
    "/committees/dv_ops",
    "/committees/dvarm",
    "/committees/mega7",
    "/committees/dvrk/bachelor",
    "/committees/dvrk/master",
].forEach(c => app.get(c, callback));

app.put("/info-screen/update", updateSlides);
app.get("/newsfeed", newsfeed);
app.get("/getPhotos", getPhotos);
app.get("/getInfoScreenSlides", getSlides);
app.get("/photos/addUser", addUser);
app.get("/photos/testCode", testCode);
app.get("/photos/photoHostGet", photoHostGet);
app.post("/photos/photoHostPost", upload.array("files"), photoHostPost);
app.get("/getKickoffEvents", getKickOffEvents);
app.get("/getEvents", getDVEvents);
app.post("/postHook", postHook);
app.post("/killerBean", killerBean);

app.get("/recceform", (req, res) => res.status(301).redirect("https://dvet.se/committees/dvrk/form"));
app.get("/recceguiden", (req, res) => servePdf(req, res, "assets/kick-off/recceguiden.pdf"));
app.get("/masterguide", (req, res) => servePdf(req, res, "assets/kick-off/masterguiden.pdf"));



const servePdf = (req, res, pdf) => {
    const filePath = path.join(process.cwd(), pdf);
    res.sendFile(filePath);
};

const port = process.env.PORT || 8080;
console.log("Server starting at: http://localhost:" + port);
app.listen(port);
