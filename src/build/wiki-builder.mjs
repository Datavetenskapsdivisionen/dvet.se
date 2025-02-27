import fs from "fs";
import { marked } from "marked";
import BabelCore from "@babel/core";

const OUTPUT_DIR = "wiki-cache";
const SOURCE_DIR = "content/wiki";
const SECRET_DIR = "Hemlisar";

const nameFixer = name => name
    .replaceAll("ä", "a").replaceAll("å", "a").replaceAll("ö", "o")
    .replaceAll("Ä", "A").replaceAll("Å", "A").replaceAll("Ö", "O")
    .replaceAll("/", "__").replace(".", "")
    .replaceAll("&", "___")
    .replaceAll(" ", "_").replace("(", "_")
    .replace(")", "_")
    .replaceAll("-", "_");

const clearDist = () => {
    try {
        let s = fs.statSync(OUTPUT_DIR);
        if (s.isDirectory()) {
            fs.rmSync(OUTPUT_DIR, { recursive: true });
        } else {
            fs.rmSync(OUTPUT_DIR);
        }
    } catch {
    }
    fs.mkdirSync(OUTPUT_DIR);
};

class File {
    constructor(name, dirData) {
        let splat = name.split("").reverse().join("").split(/\.(.*)/s).map(s => s.split("").reverse().join(""));
        if (splat.length == 1) {
            throw new Error("invalid file name: " + name);
        }
        this.extension = splat[0];
        this.name = splat[1];
        this.dirData = dirData;
    }
    show(_i) {
        return "├ " + this.name;
    }
    output(source, output) {
        source += `/${this.name}.${this.extension}`;
        if (this.extension == "md") {
            const ctime = fs.statSync(source).ctime.toLocaleString();
            const input = fs.readFileSync(source).toString();
            const parsed = marked.parse(input);
            const outputString = `
<div>\n${parsed}</div>
<div class="edit-page-button">
    <a class="actual-button" href="https://github.com/Datavetenskapsdivisionen/dvet.se/blob/master/${source}" target="_blank">
        Edit this page ✍️
    </a>
    <a>(last edited at ${ctime}, see 
        <a class="actual-button" href="https://github.com/Datavetenskapsdivisionen/dvet.se/commits/master/${source}" target="_blank">
            history
        </a>)
    </a>
</div>`;
            output += `/${this.name}.html`;
            fs.writeFile(output, outputString, err => {
                if (err) console.log(err);
            });
        } else {
            output += `/${this.name}.${this.extension}`;
            fs.copyFileSync(source, output);
        }
    }

    navtree(path) {
        if (this.extension == "md") {
            if (this.name.includes("-en-")) { // Deal with english files below
                return [`<></>`, `<></>`];
            }
            const englishFileName = this.dirData.find(n => n.includes(this.name + "-en-"));
            const englishName = englishFileName ? englishFileName.split("-en-")[1].split(".md")[0] : this.name; // Default to swedish if there is no english file
            const uri = `${path.replace(" ", "_")}/${nameFixer(this.name)}`;
            const res = `<div><Link onClick={hideNavTree} class="wiki-navtree-link" to="${uri}">{'\t'}{isEnglish() ? "${englishName}" : "${this.name}"}</Link></div>`;
            return [res, res];
        } else {
            return [`<></>`, `<></>`];
        }
    }

    __react(path) {
        if (this.extension == "md") {
            let name = `${path}/${this.name}`;
            let fancyName = nameFixer(name);
            let code = `import ${fancyName} from "${name}.html";\n`;
            return [[fancyName], code, code];
        } else {
            return null;
        }
    }
}
class Directory {
    constructor(path) {
        this.path = path;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    show(indent) {
        const top = " ".repeat(indent) + "└ " + this.path;
        let below = "";
        for (const child of this.children) {
            below += " ".repeat(indent + 2) + child.show(indent + 2);
            below += "\n";
        }
        return (top + "\n" + below).trim();
    }

    print() {
        const i = 3;
        console.log(" ".repeat(i) + this.show(i));
    }

    output(path, out) {
        if (this.path != "root") {
            path += "/" + this.path;
            out += "/" + this.path;
        }

        try { fs.mkdirSync(out); } catch { }

        for (const child of this.children) {
            child.output(path, out);
        }
    }

    navtree(path) {
        const isNotRoot = this.path != "root";
        const isSecret = this.path == SECRET_DIR;
        if (isNotRoot) {
            path += "/" + this.path;
        }
        const buttonId = this.path + "__button";
        const divId = this.path + "__div";
        const actLen = this.children
            .filter(p => p.extension && p.extension != "hidden")
            .filter(p => p.name && !p.name.includes("-en-"))
            .length;
        const hide = actLen >= 15
            ? `<button class="wiki-navtree-button" id="${buttonId}" onClick={() => hideTree("${buttonId}", "${divId}")}>${this.path} ⇓</button>`
            : "<></>";
        const show = actLen >= 15
            ? "<></>"
            : `${this.path}`;
        const hideStyle = actLen >= 15
            ? "{{display: \"none\"}}"
            : "{{}}";

        let children = isNotRoot
            ? `<a class="wiki-navtree-title">${show}${hide}</a><div style=${hideStyle} id="${divId}">`
            : `<div style=${hideStyle} id="${divId}">`;
        children = [children, children];
        for (const child of this.children) {
            let [normal, secret] = child.navtree(path);
            if (!isSecret) children[0] += normal;
            children[1] += secret;
        }
        if (isSecret) children[0] += `<div><a class="wiki-navtree-link" href="dviki/${SECRET_DIR}/Info">{'\t'}Logga In 🔒</a></div>`;
        if (actLen > 0) {
            const res = f => `<div class="wiki-navtree">${f}</div></div>`;
            return [res(children[0]), res(children[1])];
        } else {
            return [`<></>`, `<></>`];
        }
    }

    __react(path) {
        if (this.path != "root") {
            path += "/" + this.path;
        }
        const isSecret = this.path == SECRET_DIR;
        let output = "";
        let secretOutput = "";
        let names = [];
        for (const child of this.children) {
            let childOutput = child.__react(path);
            if (!childOutput) continue;
            let [newNames, newOutput, newSecretOutput] = childOutput;
            if (!isSecret) output += newOutput;
            secretOutput += newSecretOutput;
            names = names.concat(newNames);
        }
        return [names, output, secretOutput];
    }
    react(navtree, secretNavtree) {
        let output = `import React from "react";
import { useParams, Link } from "react-router-dom";
import { isEnglish } from "/src/www/util";
const hideTree = (buttonId, divId) => {
    const button = document.getElementById(buttonId);
    const div = document.getElementById(divId);
    if (div.style.display == "block") {
        div.style.display = "none";
        button.innerText = button.innerText.slice(0, -1);
        button.innerText = button.innerText + " ⇓"; 
    } else {
        div.style.display = "block";
        button.innerText = button.innerText.slice(0, -1);
        button.innerText = button.innerText + " ⇑";
    }
};

const hideNavTree = () => {
    const navtree = document.getElementById("navtree");
    navtree.classList.add("wiki-navtree-hidden");
};

const showNavTree = () => {
    const navtree = document.getElementById("navtree");
    navtree.classList.remove("wiki-navtree-hidden");
};
\n\n`;
        let secretOutput = output;
        output += `const TREE = ${navtree};`;
        secretOutput += `const TREE = ${secretNavtree};`;
        let names = [];
        for (const child of this.children) {
            let childOutput = child.__react(".");
            if (!childOutput) continue;
            let [newNames, newOutput, newSecretOutput] = childOutput;
            output += newOutput;
            secretOutput += newSecretOutput;
            names = names.concat(newNames);
        }
        let paths = "";
        for (const name of names) {
            if (name.includes("_en_")) { continue; } // deal with english files below
            const englishName = names.find(n => n.includes(name + "_en_"));

            paths += `if (path == "${name}") {
        return <main-wiki>
            <button onClick={showNavTree} class="show-tree-button">≡ Show Tree</button>
            <div id="navtree" class="wiki-navtree-root wiki-navtree-hidden"><button onClick={hideNavTree} className="close">X</button><div class="wiki-navtree-middle">{TREE}</div></div>
            <div className="page">
                { isEnglish() && ${!englishName} ? <p><em>(English version not available)</em></p> : <></> }
                <div id="wiki-page" dangerouslySetInnerHTML={{ __html: isEnglish() && ${englishName} ? ${englishName} : ${name} }}></div>
            </div>
        </main-wiki>;
    } else `;
        }

        const last = `
const me = () => {
    const params = useParams();
    const isHemlis = location.pathname.includes("${SECRET_DIR}");
    let path = "/" + params.id + "/" + params["*"];
    path = path.replaceAll("/", "__");
    if (path.endsWith("__")) {
        path = path.slice(0, -2);
    }
    if (isHemlis) path = "__${SECRET_DIR}" + path;
    if (path == "__undefined__undefined") path = "__About_Us";

    ${paths} {
        return <h1>404 invalid uri</h1>;
    };
};
export default me;
`;
        output += last;
        secretOutput += last;
        // fs.writeFile((OUTPUT_DIR + `/wiki.jsx`), output, err => {
        // if (err) console.error(err);
        // });
        // fs.writeFile((OUTPUT_DIR + `/secret-wiki.jsx`), secretOutput, err => {
        // if (err) console.error(err);
        // });
        return [output, secretOutput];
    }
}

const readDir = (name, dir) => {
    let res = new Directory(name);
    try {
        let dirData = fs.readdirSync(dir);
        for (const name of dirData) {
            const data = `${dir}/${name}`;
            let stat = fs.statSync(data);

            if (stat.isDirectory()) res.addChild(readDir(name, data));
            else res.addChild(new File(name, dirData));
        }
    } catch (error) {
        console.error(error);
    }
    return res;
};

const main = () => {
    console.log("starting wiki builder 9000");
    console.log(` - loading wiki structure (${SOURCE_DIR})`);
    let struct = readDir("root", SOURCE_DIR);
    // struct.print();
    console.log(` - creating/clearing output dir (${OUTPUT_DIR})`);
    clearDist();
    console.log(` - generating markdown...`);
    const [navtree, secretNavTree] = struct.navtree("/dviki");
    struct.output(SOURCE_DIR, OUTPUT_DIR);
    // struct.react(navtree, secretNavTree);
    let [normal, secret] = struct.react(navtree, secretNavTree);

    const compile = (code) => BabelCore.transformSync(code, {
        presets: [["@babel/preset-env", { "targets": "defaults" }], "@babel/preset-react"],
    }).code + "\nwindow.__hacky__wikiPage = () => me;";
    normal = compile(normal);
    secret = compile(secret);

    fs.writeFile((OUTPUT_DIR + `/wiki.js`), normal, err => {
        if (err) console.error(err);
    });
    fs.writeFile((OUTPUT_DIR + `/secret-wiki.js`), secret, err => {
        if (err) console.error(err);
    });

    console.log(" - done");
};
main();