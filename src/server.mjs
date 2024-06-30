import express from "express";
import path from "path";
import expressStaticGzip from "express-static-gzip";
import { fileURLToPath } from "url";
import "dotenv/config";
import multer from "multer";

const allowedTypes = ["audio/aac", "image/bmp", "text/csv", "image/gif", "image/jpeg", "video/mp4",
    "video/mpeg", "audio/ogg", "video/ogg", "image/png", "application/pdf", "image/tiff",
    "text/plain", "audio/wav", "audio/webm", "video/webm", "image/webp", "image/heic"];
const upload = multer({
    dest: "dist/uploads/",
    limits: { fileSize: 10485760 },
    fileFilter: (req, file, cb) => cb(null, allowedTypes.includes(file.mimetype))
});

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
import { photoHostPost } from "./photo-host.mjs";
import { getTokenFromGoogleOauth2 } from "./googleApi.mjs";
import { verifyToken, verifyCookieOrElse } from "./auth.mjs";


app.get("/wiki.js", (req, res) => verifyCookieOrElse(req, res,
    // Ok
    (req, res) => {
        console.log("sending secret");
        res.set("Content-Type", "application/javascript");
        res.set("Content-Encoding", "gzip");
        res.sendFile(path.resolve(__dirname, "../dist-secret/secretWiki.js.gz"));
    },
    // Or else
    (req, res) => {
        console.log("sending non-secret");
        res.set("Content-Type", "application/javascript");
        res.set("Content-Encoding", "gzip");
        res.sendFile(path.resolve(__dirname, "../dist/wiki.js.gz"));
    })
);
app.get("/dist-secret/secretWiki.js", (req, res) => res.json("💩"));
app.use(expressStaticGzip("dist", {
    serveStatic: { maxAge: 60 * 1000 }
}));
app.use(express.json());
app.get("/", callback);
app.get("/committees", callback);
app.get("/info-screen", callback);
app.get("/info-screen/edit", callback);
app.put("/info-screen/update", verifyToken, updateSlides);
app.get("/newsscreen", callback);
app.get("/scscreen", callback);
app.get("/about", callback);
app.get("/documents", callback);
app.get("/contact", callback);
app.get("/tools", callback);
app.get("/photos", callback);
app.get("/schedule", callback);
app.get("/committees/the-board", callback);
app.get("/committees/dvrk", callback);
app.get("/committees/dvrk/schedule", callback);
app.get("/committees/dvrk/schedule/bachelor", callback);
app.get("/committees/dvrk/schedule/master", callback);
app.get("/committees/dvrk/contact", callback);
app.get("/committees/dvrk/form", callback);
app.get("/committees/board-of-studies", callback);
app.get("/committees/mega6", callback);
app.get("/committees/concats", callback);
app.get("/committees/femmepp", callback);
app.get("/committees/dv_ops", callback);
app.get("/committees/dvarm", callback);
app.get("/committees/mega7", callback);
app.get("/committees/dvrk/bachelor", callback);
app.get("/committees/dvrk/master", callback);

app.get("/dviki", callback);
app.get("/dviki/:path*", callback);

app.get("/newsfeed", newsfeed);
app.get("/getPhotos", getPhotos);
app.get("/getInfoScreenSlides", getSlides);

app.get("/photos/host", callback);
app.post("/photos/post", verifyToken, upload.array("files"), photoHostPost);

app.get("/getKickoffEvents", getKickOffEvents);
app.get("/getEvents", getDVEvents);
app.post("/postHook", postHook);
app.post("/killerBean", killerBean);
app.post("/google-auth", getTokenFromGoogleOauth2);
app.post("/verify-token", verifyToken, (req, res) => res.status(200).json({ ok: "ok" }));

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
