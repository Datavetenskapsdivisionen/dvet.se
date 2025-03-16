import { exec } from 'child_process';
import { fetchBlobData, fetchRepoTree } from './octokit.mjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const COMPILERS = {
    "lualatex": { templates: ["Template/Latex/dvd.cls"] },
    "typst":    { templates: ["Template/Typst/DVD.typ", "Template/Typst/Styrelseprotokoll.typ"] }
};
const dir = path.join(process.cwd(), "/backend/latex");
const pdfDir = path.join(dir, "/pdf");
const cacheFilePath = path.join(dir, "pdf_cache.json");
const cache = fs.existsSync(cacheFilePath)
    ? JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8') || '{}') // Unable to parse cache
    : {}; // No cache file

const compileProtocol = async (req, res) => {
    const type = req.body.type;
    switch (type) {
        case "tex": return compileTexToPdf(req, res);
        case "typ": return compileTypToPdf(req, res);
        default: return res.status(400).send("Invalid protocol type");
    }
};

const sendPDF = (filePath, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) { return res.status(404).send(`Unable to send PDF file: ${err}`); }

        const base64Data = data.toString('base64');
        res.json({ base64: base64Data });
    });
};

const checkCache = (nodeId, content) => {
    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    return cache[nodeId] === checksum;
};

const updateCache = (nodeId, content) => {
    if (nodeId == undefined || content == undefined) { console.log("Error updating cache for node id", nodeId); return false; }

    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    cache[nodeId] = checksum;
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
    return true;
};

const setup = async (compiler) => {
    // Check if lualatex is installed
    let isInstalled = await new Promise((resolve, reject) => {
        const command = `which ${compiler}`;
        exec(command, async function(err, stdout, stderr) {
            if (err || stderr || !stdout) { return reject(`${compiler} not found`); }
            resolve();
        });
    })
    .then(() => { return true; })
    .catch(err => { console.error(err); return false });

    if (!isInstalled) { return false; }

    // Create directories if they don't exist
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    if (!fs.existsSync(pdfDir)) { fs.mkdirSync(pdfDir, { recursive: true }); }

    let error = false;

    for (const template of COMPILERS[compiler].templates) {
        await fetchRepoTree("Datavetenskapsdivisionen", "dokument", "master", template).then(async data => {
            if (!data) { error = true; return false; }
            await fetchBlobData("Datavetenskapsdivisionen", "dokument", data[0].url.split("/").pop()).then(async blob => {
                const templatePath = path.join(dir, template.split("/").pop());
                if (!checkCache(blob.node_id, blob.content) || !fs.existsSync(templatePath)) {
                    fs.writeFileSync(templatePath, Buffer.from(blob.content, 'base64').toString('utf-8'));
                    updateCache(blob.node_id, blob.content);
                }
            }).catch(err => {console.error("Error fetching template:", err); error = true; return false;});
        });
    }

    return !error;
};

const fetchSrcAsString = async (blobSha) => {
    const blobData = await fetchBlobData("Datavetenskapsdivisionen", "dokument", blobSha);
    const base64 = blobData.content;
    const nodeId = blobData.node_id;
    const src = Buffer.from(base64, 'base64').toString('utf-8');

    return { src, nodeId };
};

const compileTexToPdf = async (req, res) => {
    const blobSha = req.body.url.split("/").pop();
    let { src: tex, nodeId } = await fetchSrcAsString(blobSha);
    const pdfPath = path.join(pdfDir, `${nodeId}.pdf`);

    // Remove images due to laziness in parsing them
    tex = tex.replace(/\\usepackage\{graphicx\}/, '\\usepackage[draft]{graphicx}');

    // Check if PDF exists in cache
    if (checkCache(nodeId, tex) && fs.existsSync(pdfPath)) {
        return sendPDF(pdfPath, res);
    }

    // Setup LaTeX environment
    const setupSuccess = await setup("lualatex");
    if (!setupSuccess) { return res.status(500).send("Error setting up LaTeX environment"); }

    // Temporary file to compile
    fs.writeFileSync(path.join(dir, "temp.tex"), tex);
    
    // Compile LaTeX
    const command = `lualatex --halt-on-error --output-directory=${dir} ${dir}/temp.tex | grep '^!.*' -A200 --color=always`;
    const child = exec(command);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.stderr.on("data", (data) => { return res.status(500).send("Error compiling Typst:\n" + data.toString()); });
    child.on("exit", () => {
        fs.rename(`${dir}/temp.pdf`, pdfPath, (err) => {
            if (err) return res.status(500).send("Error compiling LaTeX:\n" + err);

            updateCache(nodeId, tex);
            
            let error = false;
            fs.unlink(`${dir}/temp.aux`, (err) => { if (err) error = true; });
            fs.unlink(`${dir}/temp.log`, (err) => { if (err) error = true; });
            fs.unlink(`${dir}/temp.out`, (err) => { if (err) error = true; });
            fs.unlink(`${dir}/temp.tex`, (err) => {
                if (err) error = true;
                if (error) { return res.status(500).send("Error cleaning up temporary files"); }
                sendPDF(pdfPath, res);
            });
        });
    });
};

const findAndFetchImages = async (compiler, blobPath, src) => {
    let imageRegex;
    switch (compiler) {
        case "lualatex": return [];
        case "typst": imageRegex = /image\("([^"]+)"/g; break;
        default: return false;
    }

    let match;
    const processedImages = new Set();
    while ((match = imageRegex.exec(src)) !== null) {
        const imgName = match[1];
        if (processedImages.has(imgName)) continue;
        processedImages.add(imgName);

        const currentDir = path.dirname(blobPath);
        const tree = await fetchRepoTree("Datavetenskapsdivisionen", "dokument", "master", `${currentDir}/${imgName}`);
        if (tree.length === 0) { return false; }
        const imgData = await fetchBlobData("Datavetenskapsdivisionen", "dokument", tree[0].sha).then(blob => Buffer.from(blob.content, 'base64'));

        fs.writeFileSync(`${dir}/${imgName}`, imgData);
    }

    return processedImages;
};

const compileTypToPdf = async (req, res) => {
    const blobPath = req.body.path;
    const blobSha = req.body.url.split("/").pop();
    let { src: typ, nodeId } = await fetchSrcAsString(blobSha);
    const pdfPath = path.join(pdfDir, `${nodeId}.pdf`);

    // Update template import path
    typ = typ.replace(/#import\s+"[^"]*DVD\.typ"/, '#import "DVD.typ"');

    // Check if PDF exists in cache
    if (checkCache(nodeId, typ) && fs.existsSync(pdfPath)) {
        return sendPDF(pdfPath, res);
    }

    // Setup Typst environment
    const setupSuccess = await setup("typst");
    if (!setupSuccess) { return res.status(500).send("Error setting up Typst environment"); }

    // Find images and fetch them
    const images = await findAndFetchImages("typst", blobPath, typ);
    if (!images) { return res.status(404).send(`Unable to fetch image(s) referenced in the protocol`); }

    // Temporary file to compile
    fs.writeFileSync(path.join(dir, "temp.typ"), typ);

    // Compile Typst
    const command = `typst compile ${dir}/temp.typ ${pdfPath} --root ${dir}`
    const child = exec(command);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.stderr.on("data", (data) => { return res.status(500).send("Error compiling Typst:\n" + data.toString()); });
    child.on("exit", (code, signal) => {
        if (code !== 0) { return res.status(500).send(`Typst compilation failed with code ${code} and signal ${signal}`); }
        
        updateCache(nodeId, typ);
        
        for (const imgName of images) {
            fs.unlink(`${dir}/${imgName}`, (err) => { if (err) console.error("Error deleting image", imgName); });
        }
        
        fs.unlink(`${dir}/temp.typ`, (err) => {
            if (err) { return res.status(500).send("Error cleaning up temporary files"); }
            sendPDF(pdfPath, res);
        });
    });
};

export { compileProtocol };