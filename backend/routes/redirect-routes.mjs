import { Router } from 'express';

const router = Router();

router.get("/discord", (req, res) => res.redirect("https://discord.gg/BVyhSv4rVw"));
router.get("/committees/board-of-studies", (req, res) => res.redirect("/committees/student-educational-committee"));
router.get("/recceform", (req, res) => res.status(301).redirect("https://dvet.se/committees/dvrk/form"));

export default router;
