import { exec } from 'child_process';
import { fetchBlobData, fetchRepoTree } from './octokit.mjs';
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
    if (nodeId == undefined || content == undefined) { console.log("Error updating cache for node id", nodeId); return false; }

    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    cache[nodeId] = checksum;
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
    return true;
};

const setupLaTeX = async () => {
    // Check if lualatex is installed
    let isInstalled = await new Promise((resolve, reject) => {
        const command = "which lualatex";
        exec(command, async function(err, stdout, stderr) {
            if (err || stderr || !stdout) { return reject("lualatex not found"); }
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
    await fetchRepoTree("Datavetenskapsdivisionen", "dokument", "master", "Template/Latex/dvd.cls").then(async data => {
        if (!data) { error = true; return false; }
        await fetchBlobData("Datavetenskapsdivisionen", "dokument", data[0].url.split("/").pop()).then(async blob => {
            const templatePath = path.join(dir, "dvd.cls");
            if (!checkCache(blob.node_id, blob.content) || !fs.existsSync(templatePath)) {
                fs.writeFileSync(templatePath, Buffer.from(blob.content, 'base64').toString('utf-8'));
                updateCache(blob.node_id, blob.content);
            }
        }).catch(err => {console.error("Error fetching template:", err); error = true; return false;});
    });

    return !error;
}

const compileTexToPdf = async (req, res) => {
    const blobSha = req.body.url.split("/").pop();
    const blobData = await fetchBlobData("Datavetenskapsdivisionen", "dokument", blobSha);
    const texbase64 = blobData.content;
    const nodeId = blobData.node_id;
    const tex = Buffer.from(texbase64, 'base64').toString('utf-8');
    const pdfName = path.join(pdfDir, `${nodeId}.pdf`);
    let error = false;

    if (checkCache(nodeId, tex) && fs.existsSync(pdfName)) {
        return sendPDF(pdfName, res);
    }

    error = await setupLaTeX().then(success => !success);
    if (error) { return res.status(500).send("Error setting up LaTeX environment"); }

    // Temporary file to compile
    fs.writeFileSync(path.join(dir, "temp.tex"), tex);
    
    const command = `lualatex --halt-on-error --output-directory=${dir} ${dir}/temp.tex | grep '^!.*' -A200 --color=always`;
    const child = exec(command);
    child.stdout.pipe(process.stdout);
    child.on("exit", () => {
        fs.rename(`${dir}/temp.pdf`, pdfName, (err) => {
            if (err) return res.status(500).send("Error compiling LaTeX:\n" + err);

            updateCache(nodeId, tex);
            
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