import fs from "fs";
import { marked } from "marked";

const OUTPUT_DIR = "dist/wiki";
const SOURCE_DIR = "content/wiki";

const nameFixer = name => name
    .replaceAll("/", "__").replace(".", "")
    .replaceAll(" ", "_").replace("(", "_")
    .replace(")", "_");

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
    constructor(name) {
        let splat = name.split("").reverse().join("").split(/\.(.*)/s).map(s => s.split("").reverse().join(""));
        if (splat.length == 1) {
            throw new Error("invalid file name: " + name);
        }
        this.extension = splat[0];
        this.name = splat[1];
    }
    show(_i) {
        return "├ " + this.name;
    }
    output(source, output) {
        source += `/${this.name}.${this.extension}`;
        const input = fs.readFileSync(source).toString();
        const parsed = marked.parse(input);
        const outputString = `<div class="edit-button">
<div>\n${parsed}</div>
<a class="edit-page-button" href="https://github.com/Datavetenskapsdivisionen/dvet.se/blob/master/${source}" target="_blank">Edit this page ✍️</a></div>`;
        output += `/${this.name}.html`;
        fs.writeFile(output, outputString, err => {
            if (err) console.log(err);
        });
    }

    navtree(path) {
        const uri = `${path}/${nameFixer(this.name)}`;
        return `<div><Link class="wiki-navtree-link" to="${uri}">• ${this.name}</Link></div>`;
    }

    __react(path) {
        let name = `${path}/${this.name}`;
        let fancyName = nameFixer(name);
        let code = `import ${fancyName} from "${name}.html";\n`;
        return [[fancyName], code];
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
        if (this.path != "root") {
            path += "/" + this.path;
        }
        const buttonId = this.path + "__button";
        const divId = this.path + "__div";
        const hide = this.children.length >= 10 ?
            `<button class="wiki-navtree-button" id="${buttonId}" onClick={() => hideTree("${buttonId}", "${divId}")}>⇓</button>` :
            "<></>";
        const hideStyle = this.children.length >= 10 ?
            "{{display: \"none\"}}" :
            "{{}}";
        let children = `<a class="wiki-navtree-title">{"<"}${this.path}{">"}${hide}</a><div style=${hideStyle} id="${divId}">`;
        for (const child of this.children) {
            children += child.navtree(path);
        }
        return `<div class="wiki-navtree">${children}</div></div>`;
    }

    __react(path) {
        if (this.path != "root") {
            path += "/" + this.path;
        }
        let output = "";
        let names = [];
        for (const child of this.children) {
            let [newNames, newOutput] = child.__react(path);
            output += newOutput;
            names = names.concat(newNames);
        }
        return [names, output];
    }
    react(navtree) {
        let output = `import React from "react";
import { useParams, Link } from "react-router-dom";
const hideTree = (buttonId, divId) => {
    const button = document.getElementById(buttonId);
    const div = document.getElementById(divId);
    if (div.style.display == "block") {
        div.style.display = "none";
        button.innerText = "⇓";
    } else {
        div.style.display = "block";
        button.innerText = "⇑";
    }
};
const TREE = ${navtree};
\n\n`;
        let names = [];
        for (const child of this.children) {
            let [newNames, newOutput] = child.__react(".");
            output += newOutput;
            names = names.concat(newNames);
        }
        let outputPath = OUTPUT_DIR + "/wiki.jsx";
        let paths = "";
        for (const name of names) {
            paths += `if (path == "${name}") {
        return <main-wiki>{TREE}<div className="page" dangerouslySetInnerHTML={{ __html: ${name} }}></div></main-wiki>;
    } else `;
        }

        output += `
const me = () => {
    const params = useParams();
    let path = "/" + params.id + "/" + params["*"];
    path = path.replaceAll("/", "__");
    if (path.endsWith("__")) {
        path = path.slice(0, -2);
    }
    console.log(path);
    if (path == "__undefined__undefined") path = "__About_Us";

    ${paths} {
        return <h1>404 invalid uri</h1>;
    };
};
export default me;
`;

        fs.writeFile(outputPath, output, err => {
            if (err) console.error(err);
        });
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
            else res.addChild(new File(name, dir));
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
    struct.print();
    console.log(` - creating/clearing output dir (${OUTPUT_DIR})`);
    clearDist();
    console.log(` - generating markdown...`);
    const navtree = struct.navtree("/dviki");
    struct.output(SOURCE_DIR, OUTPUT_DIR);
    struct.react(navtree);
    console.log(" - done");
};
main();