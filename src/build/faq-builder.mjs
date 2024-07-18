import Faq from "../../content/faq-page/faq-page.mjs";
import fs from "fs";

let output = "";
let outputEn = "";

if (fs.existsSync("faq-cache")) fs.rmSync("faq-cache", { recursive: true, force: true });
fs.mkdirSync("faq-cache");

for (const category of Faq) {
    output += `<div><h2>${category.name ?? "Inget Namn"}</h2>`;
    outputEn += `<div><h2>${category.name_en ?? "No Name"}</h2>`;
    output += `<div class="faq-category">`;
    outputEn += `<div class="faq-category">`;
    for (const question of category.questions) {
        let content = question.content;
        let contentEn = question.contentEn;

        output += `<div class="faq-question">
            <div class="faq-question-title">
                <button class="faq-expand-button">
                    <h2>${question.name ?? "Inget Namn"}</h2>
                    <a>▼</a>
                </button>
            </div>
        <div class="faq-container" style="grid-template-rows: 0fr;"><div class="faq-content">`;
        outputEn += `<div class="faq-question">
            <div class="faq-question-title">
                <button class="faq-expand-button">
                    <h2>${question.name ?? "No Name"}</h2>
                    <a>▼</a>
                </button>
            </div>
        <div class="faq-container" style="grid-template-rows: 0fr;"><div class="faq-content">`;
        output += content ?? "Ingen Text";
        outputEn += contentEn ?? "No Text";
        output += `</div></div></div>`;
        outputEn += `</div></div></div>`;
    }

    output += `</div></div>`;
    outputEn += `</div></div>`;
}

fs.writeFileSync("faq-cache/faq.html", output);
fs.writeFileSync("faq-cache/faq-en.html", outputEn);
