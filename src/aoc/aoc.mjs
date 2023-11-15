import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aoc = async (req, res) => {
    res.sendFile("index.html", { root: path.join(__dirname) });
};

export default aoc;