import express from "express";
import path from "path";
import expressStaticGzip from "express-static-gzip";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const callback = (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
};

import { newsfeed } from "./newsfeed.mjs";
import { postHook } from "./githookhandle.mjs";

app.use(expressStaticGzip("dist"));
app.use(express.json());
app.get("/", callback);
app.get("/committees", callback);
app.get("/about", callback);
app.get("/documents", callback);
app.get("/contact", callback);
app.get("/tools", callback);
app.get("/committees/the-board", callback);
app.get("/committees/dvrk", callback);
app.get("/committees/board-of-studies", callback);
app.get("/committees/mega6", callback);
app.get("/committees/concats", callback);
app.get("/committees/femmepp", callback);
app.get("/committees/dv_ops", callback);
app.get("/committees/dvarm", callback);
app.get("/committees/mega7", callback);
app.get("/newsfeed", newsfeed);
app.post("/postHook", postHook);


const port = process.env.PORT || 8080;
console.log("Server starting at: http://localhost:" + port);
app.listen(port);