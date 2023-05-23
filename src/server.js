const express = require("express");
const path = require("path");

const app = express();

const callback = (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
};

app.use(express.static("dist"));
app.get("/", callback);
app.get("/committees", callback);
app.get("/about", callback);
app.get("/documents", callback);
app.get("/contact", callback);


const port = process.env.PORT || 8080;
console.log("Server starting at: http://localhost:" + port);
app.listen(port);