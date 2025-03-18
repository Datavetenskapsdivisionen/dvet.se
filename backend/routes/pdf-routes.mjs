import path from "path";
import { Router } from "express";

const servePdf = (req, res, pdf) => {
    const filePath = path.join(process.cwd(), pdf);
    res.sendFile(filePath);
};

const router = Router();

router.get("/recceguiden", (req, res) => servePdf(req, res, "frontend/assets/kick-off/recceguiden.pdf"));
router.get("/masterguide", (req, res) => servePdf(req, res, "frontend/assets/kick-off/masterguiden.pdf"));

export default router;
