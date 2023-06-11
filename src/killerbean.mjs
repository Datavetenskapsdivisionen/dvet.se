const KILL_TOKEN = process.env.KILL_TOKEN ?
    process.env.KILL_TOKEN : process.exit(1);

const me = (req, res) => {
    const token = req.get("X-Dvet-Token");
    if (token == KILL_TOKEN) {
        console.log("Received good token, restarting!");
        res.status(200);
        res.send("");
        process.exit();
    } else {
        console.error("Received fake bean token! \"" + token + "\"");
        res.status(401);
        res.send("");
    }
};

export default me;