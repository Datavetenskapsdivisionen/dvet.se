import { octokit, fetchName } from "./octokit";
import crypto from "crypto";
import { Request, Response } from "express";
import { IssuesLabeledEvent } from "@octokit/webhooks-types";


const webhookUrl = process.env.WEBHOOK_URL ?
    process.env.WEBHOOK_URL : process.exit(1);
const webhookSecret = process.env.WEBHOOK_SECRET ?
    process.env.WEBHOOK_SECRET : process.exit(1);

const handleHook = async (hookData: IssuesLabeledEvent) => {
    const issue = hookData.issue;
    if (issue.labels) {
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
            const body = issue.body ? issue.body : "";

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

const markAsPosted = (issueNumber: number) => {
    octokit.rest.issues.addLabels({
        owner: "Datavetenskapsdivisionen",
        repo: "posts",
        issue_number: issueNumber,
        labels: ["state:discordPublished"]
    });
};

const verifySignature = (ver: string, data: string) => {
    const hmac = crypto.createHmac("sha256", webhookSecret);
    hmac.write(data);
    const output = "sha256=" + hmac.digest("hex");
    return ver == output;
};

const postHook = async (req: Request, res: Response) => {
    const signature = req.get("X-Hub-Signature-256");
    if (signature) {
        const body = req.body;
        const ok = verifySignature(signature, JSON.stringify(body));
        if (ok && req.body.issue && req.body.action == "labeled") {
            handleHook(req.body);
            res.status(200);
            res.send("");
            return;
        }
    }
    res.status(401);
    res.send("");
};

export { postHook };
