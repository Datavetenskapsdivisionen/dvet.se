import path from "path";
import { Router } from "express";

const servePdf = (req, res, pdf) => {
    const filePath = path.join(process.cwd(), pdf);
    res.sendFile(filePath);
};

const router = Router();

router.get("/recceguiden", (req, res) => servePdf(req, res, "frontend/assets/kick-off/recceguiden26.pdf"));
router.get("/masterguide", (req, res) => servePdf(req, res, "frontend/assets/kick-off/MASTERguiden26.pdf"));

export default router;
