import multer from "multer";
import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";

import { googleLogin } from "../route-handlers/googleApi.mjs";
import { githubLogin, isAuthWithGithub, githubLogout } from "../route-handlers/github-auth.mjs";
import { verifyToken, verifyCookieOrElse } from "../route-handlers/auth.mjs";
import { updateSlides } from "../route-handlers/info-screen.mjs";
import { getInvoiceData, getInvoice, createInvoice, createTempInvoice, addCustomer, deleteCustomer } from "../route-handlers/invoice.mjs";
import { newsfeed, addReaction, deleteReaction, addComment, editComment, deleteComment } from "../route-handlers/newsfeed.mjs";
import { getPhotos } from "../route-handlers/photos.mjs";
import { getSlides } from "../route-handlers/info-screen.mjs";
import { photoHostPost, getUserPhotos, deleteUserPhoto } from "../route-handlers/photo-host.mjs";
import { getKickOffEvents, getDVEvents } from "../route-handlers/events.mjs";
import { getWeather } from "../route-handlers/weather.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const allowedTypes = ["audio/aac", "image/bmp", "text/csv", "image/gif", "image/jpeg", "video/mp4",
    "video/mpeg", "audio/ogg", "video/ogg", "image/png", "application/pdf", "image/tiff",
    "text/plain", "audio/wav", "audio/webm", "video/webm", "image/webp", "image/heic"];
const upload = multer({
    dest: "frontend/dist/uploads/",
    limits: { fileSize: 10485760 },
    fileFilter: (req, file, cb) => cb(null, allowedTypes.includes(file.mimetype))
});

const router = Router();

router.post("/api/verify-token", verifyToken, (req, res) => res.status(200).json({ ok: "ok" }));

router.post("/api/google-auth", googleLogin);

router.get("/api/github-auth", githubLogin);
router.post("/api/github-auth", isAuthWithGithub);
router.post("/api/github-auth/logout", githubLogout);

router.get("/api/wiki-data", (req, res) => verifyCookieOrElse(req, res,
    // Ok
    (req, res) => {
        res.set("Content-Type", "application/javascript");
        res.set("Content-Encoding", "gzip");
        res.sendFile(path.resolve(__dirname, "../../frontend/dist-secret/secretWiki.js.gz"));
    },
    // Or else
    (req, res) => {
        res.set("Content-Type", "application/javascript");
        res.set("Content-Encoding", "gzip");
        res.sendFile(path.resolve(__dirname, "../../frontend/dist-secret/wiki.js.gz"));
    })
);

router.get("/api/styrelsen/invoice-data", verifyToken, getInvoiceData);
router.get("/api/styrelsen/invoice/:invoice", verifyToken, getInvoice);
router.post("/api/styrelsen/invoice", verifyToken, createInvoice);
router.post("/api/styrelsen/invoice/createPreview", verifyToken, createTempInvoice);
router.post("/api/styrelsen/invoice/add-customer", verifyToken, addCustomer);
router.delete("/api/styrelsen/invoice/delete-customer/:customer", verifyToken, deleteCustomer);

router.get("/api/newsfeed", newsfeed);
router.post("/api/newsfeed/:postId/react", addReaction);
router.delete("/api/newsfeed/:postId/react/:reactionId", deleteReaction);
router.post("/api/newsfeed/:postId/comment", addComment);
router.put("/api/newsfeed/:postId/comment/:commentId", editComment);
router.delete("/api/newsfeed/:postId/comment/:commentId", deleteComment);

router.get("/api/info-screen", getSlides);
router.put("/api/info-screen/update", verifyToken, updateSlides);

router.get("/api/photos", getPhotos);
router.post("/api/photos/post", verifyToken, upload.array("files"), photoHostPost);
router.get("/api/user/photos", verifyToken, getUserPhotos);
router.delete("/api/user/photos/:hash", verifyToken, deleteUserPhoto);

router.get("/api/kickoff-events", getKickOffEvents);
router.get("/api/events", getDVEvents);

router.get("/api/weather", getWeather);

export default router;