import fs from "fs";
import { octokit, fetchName } from "./octokit.mjs";
import crypto, { sign } from "crypto";

const data = fs.readFileSync("test-data/label2.json");
const parsed = JSON.parse(data);


const webhookUrl = process.env.WEBHOOK_URL;

const handleHook = async (hookData) => {
    if (hookData.issue && hookData.action == "labeled") {
        const issue = hookData.issue;
        const names = issue.labels.map(e => e.name);
        const filtered = names.filter(n => n == "state:published" || n == "type:post");
        if (filtered.length == 2 && issue.state == "open") {
            const user = hookData.sender.login;
            const name = await fetchName(user);
            const avatar = hookData.sender.avatar_url;
            const url = issue.html_url;
            const title = issue.title;
            const body = issue.body;

            const content = {
                content: body,
                username: name,
                avatar_url: avatar,
                embeds: [],
            };

            fetch(webhookUrl, {
                method: "POST",
                body: JSON.stringify(content),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            })
                .then(_ => console.log("Successfully sent out webhook notice"))
                .catch(e => console.error("Failed to send out webhook notice: " + e));
        }
    }
};

const postHook = async (req, res) => {
    const signature = req.get("X-Hub-Signature-256");
    console.log("dump: " + signature);
    res.status(200);
    res.send("");
};

export { postHook };

//handleHook(parsed);
//const signature = "95c768a87f675104eb751e97bfd69005e919979da7c22448a0455ff8c3bbfedd";
//const secret = process.env.WEBHOOK_SECRET;
//const body = fs.readFileSync("test-data/body.json");
//const hmac = crypto.createHmac("sha256", secret);
//hmac.write(body);
//console.log(hmac.digest("hex"));
//console.log(signature);