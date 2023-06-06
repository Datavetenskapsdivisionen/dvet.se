import express, { Request, Response } from "express";
import path from "path";
import expressStaticGzip from "express-static-gzip";
import "dotenv/config";

const app = express();

const callback = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../dist/www/index.html"));
};

import { newsFeed } from "./newsfeed";
import { postHook } from "./githookhandle";

app.use(expressStaticGzip(path.join(__dirname, "../dist/www/"), {}));
app.use(express.json());
app.get("/", callback);
app.get("/committees", callback);
app.get("/about", callback);
app.get("/documents", callback);
app.get("/contact", callback);
app.get("/tools", callback);
app.get("/committees/the-board", callback);
app.get("/committees/dvrk", callback);
app.get("/committees/dvrk/schedule", callback);
app.get("/committees/dvrk/content", callback);
app.get("/committees/board-of-studies", callback);
app.get("/committees/mega6", callback);
app.get("/committees/concats", callback);
app.get("/committees/femmepp", callback);
app.get("/committees/dv_ops", callback);
app.get("/committees/dvarm", callback);
app.get("/committees/mega7", callback);
app.get("/newsfeed", newsFeed);
app.post("/postHook", postHook);


const port = process.env.PORT || 8080;
console.log("Server starting at: http://localhost:" + port);
app.listen(port);