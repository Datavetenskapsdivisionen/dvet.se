import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import expressStaticGzip from "express-static-gzip";
import chalk from "chalk";

import killerBean from "./route-handlers/killerbean.mjs"; // kills the server
import { postHook } from "./route-handlers/githookhandle.mjs";

import apiRoutes from "./routes/api-routes.mjs";
import frontendRoutes from "./routes/frontend-routes.mjs";
import pdfRoutes from "./routes/pdf-routes.mjs";
import redirectRoutes from "./routes/redirect-routes.mjs";

// Check for missing environment variables
if (!process.env.KILL_TOKEN)          console.warn(chalk.yellow("[WARNING] KILL_TOKEN was not found in .env - You won't be able to restart the server remotely."));
if (!process.env.ENABLE_DRIVE)        console.warn(chalk.yellow("[WARNING] ENABLE_DRIVE is false or was not found in .env - Google Drive features will be disabled."));
if (!process.env.WEBHOOK_SECRET)      console.warn(chalk.yellow("[WARNING] WEBHOOK_SECRET was not found in .env - GitHub webhook features will be disabled."));
if (!process.env.WEBHOOK_URL)         console.warn(chalk.yellow("[WARNING] WEBHOOK_URL was not found in .env - Discord news posting will be disabled."));
if (!process.env.GITHUB_TOKEN)        console.warn(chalk.yellow("[WARNING] GITHUB_TOKEN was not found in .env - The GitHub API will still work but you might get rate limited."));
if (!process.env.GITHUB_APP_CLIENT_ID ||
    !process.env.GITHUB_APP_SECRET)   console.warn(chalk.yellow("[WARNING] GITHUB_APP_CLIENT_ID and GITHUB_APP_SECRET were not found in .env - Certain GitHub features that requires logging in will be disabled."));
if (!process.env.JWT_SECRET_KEY)      console.warn(chalk.yellow("[WARNING] JWT_SECRET_KEY was not found in .env - You won't be able to store user information."));

// Create express app
const app = express();

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

// Middlewares
app.use(cookieParser());
app.use(expressStaticGzip("frontend/dist", { // Middleware for serving static files (React frontend)
    serveStatic: { maxAge: 60 * 1000 }
}));
app.use(express.json()); // Middleware for parsing JSON

// Routes
app.use(apiRoutes);
app.use(frontendRoutes);
app.use(pdfRoutes);
app.use(redirectRoutes);

// Used externally
app.post("/postHook", postHook);
app.post("/killerBean", killerBean);

// Health check
app.get("/ping", (req, res) => res.status(200).send("pong"));

const port = process.env.PORT || 8080;
console.log(chalk.greenBright("Server starting at: http://localhost:" + port));
app.listen(port);
