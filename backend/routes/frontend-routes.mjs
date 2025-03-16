import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";
import { githubCallback } from "../route-handlers/github-auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serveFrontend = (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
};

const router = Router();

router.get("/", serveFrontend);
router.get("/newsscreen", serveFrontend);
router.get("/scscreen", serveFrontend);
router.get("/about", serveFrontend);
router.get("/contact", serveFrontend);
router.get("/photos", serveFrontend);
router.get("/protocols", serveFrontend);
router.get("/protocols/:path*", serveFrontend);
router.get("/faq", serveFrontend);
router.get("/schedule", serveFrontend);
router.get("/privacy-policy", serveFrontend);

router.get("/dviki", serveFrontend);
router.get("/dviki/:path*", serveFrontend);

router.get("/committees", serveFrontend);
router.get("/committees/the-board", serveFrontend);
router.get("/committees/dvrk", serveFrontend);
router.get("/committees/dvrk/schedule", serveFrontend);
router.get("/committees/dvrk/schedule/bachelor", serveFrontend);
router.get("/committees/dvrk/schedule/master", serveFrontend);
router.get("/committees/dvrk/contact", serveFrontend);
router.get("/committees/dvrk/form", serveFrontend);
router.get("/committees/student-educational-committee", serveFrontend);
router.get("/committees/mega6", serveFrontend);
router.get("/committees/concats", serveFrontend);
router.get("/committees/femmepp", serveFrontend);
router.get("/committees/dv_ops", serveFrontend);
router.get("/committees/dvarm", serveFrontend);
router.get("/committees/mega7", serveFrontend);
router.get("/committees/dvrk/bachelor", serveFrontend);
router.get("/committees/dvrk/master", serveFrontend);

router.get("/info-screen", (req, res) => {
    res.cookie("language", "en", { maxAge: 1000*60*60*24*364 });
    serveFrontend(req, res);
});
router.get("/info-screen/edit", serveFrontend);

router.get("/styrelsen/invoice-generator", serveFrontend);
router.get("/photos/host", serveFrontend);

router.get("/github-auth/authorised", githubCallback, serveFrontend);

export default router;