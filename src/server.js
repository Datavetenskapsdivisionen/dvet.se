const express = require("express");
const path = require("path");

const app = express();
app.use(express.static("dist"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
});

const port = process.env.PORT || 8080;
console.log("Server starting at: http://localhost:" + port);
app.listen(port);