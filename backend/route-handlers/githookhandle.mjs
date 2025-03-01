import { octokit, fetchName } from "../helpers/octokit.mjs";
import crypto from "crypto";

const webhookUrl = process.env.WEBHOOK_URL;

const handleHook = async (hookData) => {
    if (hookData.issue && hookData.action == "labeled") {
        const issue = hookData.issue;
        const names = issue.labels.map(e => e.name);
        const filtered = names.filter(n =>
            n == "state:published"
            || n == "type:post"
        );
        const discordPublished = names.filter(n =>
            n == "state:discordPublished"
        );
        if (discordPublished.length == 0 && filtered.length == 2 && issue.state == "open") {
            const user = issue.user.login;
            const name = await fetchName(user);
            const avatar = issue.user.avatar_url;
            const url = issue.html_url;
            const title = issue.title;
            const body = issue.body;


            const imageRegex = /!\[(.+)\]\((.+)\)\n?/g;
            const parsed = body.replace(imageRegex, "");
            //const imageNames = [...body.matchAll(imageRegex)].map(e => e[1]);
            const imagesUrls = [...body.matchAll(imageRegex)].map(e => e[2]);
            //const images = imageNames.map((e, i) => [e, imagesUrls[i]]);

            const content = {
                content: parsed + "\n-- " + name + " \[[link to post](<" + url + ">)\]",
                username: title,
                avatar_url: avatar,
                embeds: imagesUrls.map(u => {
                    return {
                        color: 16107105,
                        image: {
                            url: u
                        }
                    };
                }),
            };
            const packet = {
                method: "POST",
                body: JSON.stringify(content),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            };

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
