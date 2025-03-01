import Faq from "../content/faq-page/faq-page.mjs";
import fs from "fs";

let output = "";
let outputEn = "";

const OUTPUT_DIR = "frontend/faq-cache";
if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR);

const createQuestion = question => {
    const doneTextLeft = question.content ? "" : " 👺 ";
    const doneTextRight = question.content_en ? "" : " ⚠️ ";
    let output = "";
    let outputEn = "";

    let content = question.content;
    let contentEn = question.content_en;

    output += `<div class="faq-question">
        <div class="faq-question-title">
            <button class="faq-expand-button">
                <h2>${doneTextLeft}${question.name ?? "Inget Namn"}${doneTextRight}</h2>
                <a>▼</a>
            </button>
        </div>
    <div class="faq-container" style="height: 0;"><div class="faq-content">`;
    outputEn += `<div class="faq-question">
        <div class="faq-question-title">
            <button class="faq-expand-button">
                <h2>${doneTextLeft}${question.name_en ?? "No Name"}${doneTextRight}</h2>
                <a>▼</a>
            </button>
        </div>
    <div class="faq-container" style="height: 0;"><div class="faq-content">`;
    output += content ?? "<p>Ingen Text</p>";
    outputEn += contentEn ?? "<p>No Text</p>";
    output += `</div></div></div>`;
    outputEn += `</div></div></div>`;

    return [output, outputEn];
};

for (const category of Faq) {
    const id = "FaqCategory" + encodeURI(category.name_en ?? "no_name");
    const href = `<a class="faq-href" href="#${id}">#</a>`;
    output += `<div id="${id}"><h2>${href} ${category.name ?? "Inget Namn"}</h2>`;
    outputEn += `<div id="${id}"><h2>${href} ${category.name_en ?? "No Name"}</h2>`;
    output += `<div class="faq-category">`;
    outputEn += `<div class="faq-category">`;

    let q1 = [];
    let q2 = [];
    let flippy = true;
    for (const question of category.questions) {
        if (flippy) q1.push(question);
        else q2.push(question);
        flippy = !flippy;
    }

    output += `<div class="faq-category-split">`;
    outputEn += `<div class="faq-category-split">`;
    q1.forEach(question => {
        let [o, oEn] = createQuestion(question);
        output += o;
        outputEn += oEn;
    });
    output += "</div>";
    outputEn += "</div>";
    output += `<div class="faq-category-split">`;
    outputEn += `<div class="faq-category-split">`;
    q2.forEach(question => {
        let [o, oEn] = createQuestion(question);
        output += o;
        outputEn += oEn;
    });
    output += "</div>";
    outputEn += "</div>";

    output += `</div></div>`;
    outputEn += `</div></div>`;
}

fs.writeFileSync(`${OUTPUT_DIR}/faq.html`, output);
fs.writeFileSync(`${OUTPUT_DIR}/faq-en.html`, outputEn);
