import { exec } from 'child_process';
import { fetchRepoTree } from './octokit.mjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dir = path.join(process.cwd(), "/backend/latex");
const pdfDir = path.join(dir, "/pdf");
const cacheFilePath = path.join(dir, "pdf_cache.json");
const cache = fs.existsSync(cacheFilePath)
    ? JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8') || '{}') // Unable to parse cache
    : {}; // No cache file

const sendPDF = (filePath, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) { return res.status(404).send('File not found'); }

        const base64Data = data.toString('base64');
        res.json({ base64: base64Data });
    });
};

const checkCache = (nodeId, content) => {
    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    return cache[nodeId] === checksum;
};

const updateCache = (nodeId, content) => {
    if (nodeId == undefined || content == undefined) { console.log("error updating cache for node id", nodeId); return false; }

    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    cache[nodeId] = checksum;
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
    return true;
};

const setupLaTeX = () => {
    // Create directories if they don't exist
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    if (!fs.existsSync(pdfDir)) { fs.mkdirSync(pdfDir, { recursive: true }); }

    fetchRepoTree("Datavetenskapsdivisionen", "dokument", "master", "Template/Latex/dvd.cls").then(data => {
        if (!data) { return false; }

        fetch(data[0].url).then(response => response.json()).then(json => {
            const templatePath = path.join(dir, "dvd.cls");
            if (!checkCache(json.node_id, json.content) || !fs.existsSync(templatePath)) {
                fs.writeFileSync(templatePath, Buffer.from(json.content, 'base64').toString('utf-8'));
                updateCache(json.node_id, json.content);
            }
        }).catch(err => {console.error("Error fetching template:", err); return false;});
    });

    return true;
}

const compileTexToPdf = async (req, res) => {
    const texbase64 = req.body.content;
    const nodeId = req.body.nodeId;
    const tex = Buffer.from(texbase64, 'base64').toString('utf-8');
    const pdfName = path.join(pdfDir, `${nodeId}.pdf`);

    if (checkCache(nodeId, tex) && fs.existsSync(pdfName)) {
        return sendPDF(pdfName, res);
    }

    if (!setupLaTeX()) {
        return res.status(500).send("Error setting up LaTeX environment");
    }

    // Temporary file to compile
    fs.writeFileSync(path.join(dir, "temp.tex"), tex);
    
    const command = `lualatex --halt-on-error --output-directory=${dir} ${dir}/temp.tex | grep '^!.*' -A200 --color=always`;
    const child = exec(command);
    child.stdout.pipe(process.stdout);
    child.on("exit", () => {
        fs.rename(`${dir}/temp.pdf`, pdfName, (err) => {
            if (err) return res.status(500).send("Error compiling LaTeX:\n" + err);

            updateCache(nodeId, tex);
            
            let error = false;
            fs.unlink(`${dir}/temp.aux`, (err) => { if (err) error = true; });
            fs.unlink(`${dir}/temp.log`, (err) => { if (err) error = true; });
            fs.unlink(`${dir}/temp.out`, (err) => { if (err) error = true; });
            fs.unlink(`${dir}/temp.tex`, (err) => {
                if (err) error = true;
                if (error) { return res.status(500).send("Error cleaning up temporary files"); }
                sendPDF(pdfName, res);
            });
        });
    });
};

const compileTypToPdf = (typ) => {

};

export { compileTexToPdf, compileTypToPdf };