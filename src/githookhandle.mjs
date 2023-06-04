import { octokit, fetchName } from "./octokit.mjs";
import crypto from "crypto";



const webhookUrl = process.env.WEBHOOK_URL;

const handleHook = async (hookData) => {
    if (hookData.issue && hookData.action == "labeled") {
        const issue = hookData.issue;
        const names = issue.labels.map(e => e.name);
        const filtered = names.filter(n =>
            n == "state:published"
            || n == "type:post"
            || n == "state:discordPublished"
        );
        if (filtered.length == 2 && issue.state == "open") {
            const user = hookData.sender.login;
            const name = await fetchName(user);
            const avatar = hookData.sender.avatar_url;
            const url = issue.html_url;
            const title = issue.title;
            const body = issue.body;

            const content = {
                content: "# " + title + "\n" + body + "\n\nLink: <" + url + ">",
                username: name,
                avatar_url: avatar,
                embeds: [],
            };
            const packet = {
                method: "POST",
                body: JSON.stringify(content),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            };
            console.log("Packet: " + JSON.stringify(packet));


            fetch(webhookUrl, packet)
                .then(_ => markAsPosted(issue.number))
                .catch(e => console.error("Failed to send out webhook notice: " + e));
        }
    }
};

const markAsPosted = (issueNumber) => {
    octokit.rest.issues.addLabels({
        owner: "Datavetenskapsdivisionen",
        repo: "posts",
        issue_number: issueNumber,
        labels: ["state:discordPublished"]
    });
};

const verifySignature = (ver, data) => {
    const secret = process.env.WEBHOOK_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.write(data);
    const output = "sha256=" + hmac.digest("hex");
    return ver == output;
};

const postHook = async (req, res) => {
    const signature = req.get("X-Hub-Signature-256");
    const body = req.body;
    const ok = verifySignature(signature, JSON.stringify(body));
    if (ok) {
        handleHook(req.body);
    }
    res.status(200);
    res.send("");
};

export { postHook };
