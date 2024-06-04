import fs from "fs";
import { marked } from "marked";

const OUTPUT_DIR = "dist/wiki";
const SOURCE_DIR = "content/wiki";


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
    output(source, output, navtree) {
        source += `/${this.name}.${this.extension}`;
        const input = fs.readFileSync(source).toString();
        const parsed = marked.parse(input);
        const outputString = `<div>${navtree}</div>\n<main>\n${parsed}</main>`;
        output += `/${this.name}.html`;
        fs.writeFile(output, outputString, err => {
            if (err) console.log(err);
        });
    }

    navtree(path) {
        const uri = `${path}%2F${this.name}.html`;
        return `<li><a href="${uri}">${this.name}</button></li>`;
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

    output(path, out, navtree) {
        if (this.path != "root") {
            path += "/" + this.path;
            out += "/" + this.path;
        }

        try { fs.mkdirSync(out); } catch { }

        for (const child of this.children) {
            child.output(path, out, navtree);
        }
    }

    navtree(path) {
        if (this.path != "root") {
            path += "%2F" + this.path;
        }
        let children = `<li>${this.path}</li>`;
        for (const child of this.children) {
            children += child.navtree(path);
        }
        return `<ul>${children}</ul>`;
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
    const navtree = struct.navtree("/wiki?uri=");
    struct.output(SOURCE_DIR, OUTPUT_DIR, navtree);
    console.log(" - done");
};
main();