import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import expressStaticGzip from "express-static-gzip";
import { fileURLToPath } from "url";
import multer from "multer";
import chalk from "chalk";

if (!process.env.KILL_TOKEN)          console.warn(chalk.yellow("[WARNING] KILL_TOKEN was not found in .env - You won't be able to restart the server remotely."));
if (!process.env.ENABLE_DRIVE)        console.warn(chalk.yellow("[WARNING] ENABLE_DRIVE is false or was not found in .env - Google Drive features will be disabled."));
if (!process.env.WEBHOOK_SECRET)      console.warn(chalk.yellow("[WARNING] WEBHOOK_SECRET was not found in .env - GitHub webhook features will be disabled."));
if (!process.env.WEBHOOK_URL)         console.warn(chalk.yellow("[WARNING] WEBHOOK_URL was not found in .env - Discord news posting will be disabled."));
if (!process.env.GITHUB_TOKEN)        console.warn(chalk.yellow("[WARNING] GITHUB_TOKEN was not found in .env - The GitHub API will still work but you might get rate limited."));
if (!process.env.GITHUB_APP_CLIENT_ID ||
    !process.env.GITHUB_APP_SECRET)   console.warn(chalk.yellow("[WARNING] GITHUB_APP_CLIENT_ID and GITHUB_APP_SECRET were not found in .env - Certain GitHub features that requires logging in will be disabled."));
if (!process.env.JWT_SECRET_KEY)      console.warn(chalk.yellow("[WARNING] JWT_SECRET_KEY was not found in .env - You won't be able to store user information."));

const allowedTypes = ["audio/aac", "image/bmp", "text/csv", "image/gif", "image/jpeg", "video/mp4",
    "video/mpeg", "audio/ogg", "video/ogg", "image/png", "application/pdf", "image/tiff",
    "text/plain", "audio/wav", "audio/webm", "video/webm", "image/webp", "image/heic"];
const upload = multer({
    dest: "frontend/dist/uploads/",
    limits: { fileSize: 10485760 },
    fileFilter: (req, file, cb) => cb(null, allowedTypes.includes(file.mimetype))
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());

import killerBean from "./route-handlers/killerbean.mjs"; // kills the server
import { getInvoiceData, getInvoice, createInvoice, createTempInvoice, addCustomer, deleteCustomer } from "./route-handlers/invoice.mjs";
import { newsfeed, addReaction, deleteReaction, addComment, editComment, deleteComment } from "./route-handlers/newsfeed.mjs";
import { postHook } from "./route-handlers/githookhandle.mjs";
import { getPhotos } from "./route-handlers/photos.mjs";
import { getSlides, updateSlides } from "./route-handlers/info-screen.mjs";
import { getKickOffEvents, getDVEvents } from "./route-handlers/events.mjs";
import { deleteUserPhoto, getUserPhotos, photoHostPost } from "./route-handlers/photo-host.mjs";
import { isAuthWithGithub, githubLogin, githubCallback, githubLogout } from "./route-handlers/github-auth.mjs";
import { googleLogin } from "./route-handlers/googleApi.mjs";
import { verifyToken, verifyCookieOrElse, belongsToGroups } from "./route-handlers/auth.mjs";
import { getWeather } from "./route-handlers/weather.mjs";

// Middleware for handling trailing slashes and non-www requests
app.use((req, res, next) => {
    if (req.hostname === "dvet.se") {
        res.redirect(301, req.protocol + "://www.dvet.se" + req.originalUrl);
    }

    if (req.path.slice(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
        res.redirect(301, safepath + query);
    } else {
       next();
    }
});

app.get("/dist-secret/:path*", (req, res) => {
    res.set("Content-Type", "application/javascript");
    res.send(`"💩";`);
});

// Middleware for serving static files (React frontend)
app.use(expressStaticGzip("frontend/dist", {
    serveStatic: { maxAge: 60 * 1000 }
}));

const serveFrontend = (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
};

// Middleware for parsing JSON
app.use(express.json());

app.get("/", serveFrontend);
app.get("/committees", serveFrontend);
app.get("/info-screen", (req, res) => {
    res.cookie("language", "en", { maxAge: 1000*60*60*24*364 });
    serveFrontend(req, res);
});
app.get("/info-screen/edit", serveFrontend);
app.put("/api/info-screen/update", verifyToken, updateSlides);
app.get("/newsscreen", serveFrontend);
app.get("/scscreen", serveFrontend);
app.get("/about", serveFrontend);
app.get("/contact", serveFrontend);
app.get("/tools", serveFrontend);
app.get("/photos", serveFrontend);
app.get("/faq", serveFrontend);
app.get("/schedule", serveFrontend);
app.get("/privacy-policy", serveFrontend);
app.get("/committees/the-board", serveFrontend);
app.get("/committees/dvrk", serveFrontend);
app.get("/committees/dvrk/schedule", serveFrontend);
app.get("/committees/dvrk/schedule/bachelor", serveFrontend);
app.get("/committees/dvrk/schedule/master", serveFrontend);
app.get("/committees/dvrk/contact", serveFrontend);
app.get("/committees/dvrk/form", serveFrontend);
app.get("/committees/board-of-studies", (req, res) => res.redirect("/committees/student-educational-committee"));
app.get("/committees/student-educational-committee", serveFrontend);
app.get("/committees/mega6", serveFrontend);
app.get("/committees/concats", serveFrontend);
app.get("/committees/femmepp", serveFrontend);
app.get("/committees/dv_ops", serveFrontend);
app.get("/committees/dvarm", serveFrontend);
app.get("/committees/mega7", serveFrontend);
app.get("/committees/dvrk/bachelor", serveFrontend);
app.get("/committees/dvrk/master", serveFrontend);

app.get("/dviki", serveFrontend);
app.get("/dviki/:path*", serveFrontend);
app.get("/api/wiki-data", (req, res) => verifyCookieOrElse(req, res,
    // Ok
    (req, res) => {
        res.set("Content-Type", "application/javascript");
        res.set("Content-Encoding", "gzip");
        res.sendFile(path.resolve(__dirname, "../frontend/dist-secret/secretWiki.js.gz"));
    },
    // Or else
    (req, res) => {
        res.set("Content-Type", "application/javascript");
        res.set("Content-Encoding", "gzip");
        res.sendFile(path.resolve(__dirname, "../frontend/dist-secret/wiki.js.gz"));
    })
);

app.get("/styrelsen/invoice-generator", serveFrontend);
app.get("/api/styrelsen/invoice-data", verifyToken, getInvoiceData);
app.get("/api/styrelsen/invoice/:invoice", verifyToken, getInvoice);
app.post("/api/styrelsen/invoice", verifyToken, createInvoice);
app.post("/api/styrelsen/invoice/createPreview", verifyToken, createTempInvoice);
app.post("/api/styrelsen/invoice/add-customer", verifyToken, addCustomer);
app.delete("/api/styrelsen/invoice/delete-customer/:customer", verifyToken, deleteCustomer);

app.get("/api/newsfeed", newsfeed);
app.post("/api/newsfeed/:postId/react", addReaction);
app.delete("/api/newsfeed/:postId/react/:reactionId", deleteReaction);
app.post("/api/newsfeed/:postId/comment", addComment);
app.put("/api/newsfeed/:postId/comment/:commentId", editComment);
app.delete("/api/newsfeed/:postId/comment/:commentId", deleteComment);

app.get("/api/photos", getPhotos);
app.get("/api/info-screen", getSlides);

app.get("/photos/host", serveFrontend);
app.post("/api/photos/post", verifyToken, upload.array("files"), photoHostPost);
app.get("/api/user/photos", verifyToken, getUserPhotos);
app.delete("/api/user/photos/:hash", verifyToken, deleteUserPhoto);

app.get("/api/kickoff-events", getKickOffEvents);
app.get("/api/events", getDVEvents);
app.get("/api/github-auth", githubLogin);
app.get("/github-auth/authorised", githubCallback, serveFrontend);
app.post("/api/github-auth", isAuthWithGithub);
app.post("/api/github-auth/logout", githubLogout);
app.post("/postHook", postHook);
app.post("/killerBean", killerBean);
app.post("/api/google-auth", googleLogin);
app.post("/api/verify-token", verifyToken, (req, res) => res.status(200).json({ ok: "ok" }));

app.get("/recceform", (req, res) => res.status(301).redirect("https://dvet.se/committees/dvrk/form"));
app.get("/recceguiden", (req, res) => servePdf(req, res, "../frontend/assets/kick-off/recceguiden.pdf"));
app.get("/masterguide", (req, res) => servePdf(req, res, "../frontend/assets/kick-off/masterguiden.pdf"));

app.get("/discord", (req, res) => res.redirect("https://discord.gg/BVyhSv4rVw"));
app.get("/api/weather", getWeather);

app.get("/ping", (req, res) => res.status(200).send("pong"));

const servePdf = (req, res, pdf) => {
    const filePath = path.join(process.cwd(), pdf);
    res.sendFile(filePath);
};

const port = process.env.PORT || 8080;
console.log(chalk.greenBright("Server starting at: http://localhost:" + port));
app.listen(port);
