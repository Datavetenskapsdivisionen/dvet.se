import { fetchRepoTree } from "../helpers/octokit.mjs";

const getBoardProtocols = async (req, res) => {
    const data = await fetchRepoTree("Datavetenskapsdivisionen", "dokument", "master", "Protokoll");
    
    const root = {
        type: "dir",
        children: [],
    };

    const findOrCreateDir = (parent, dirName, item) => {
        let dir = parent.children.find(child => child.name === dirName && child.type === "dir");
        if (!dir) {
            dir = {
                type: "dir",
                name: dirName,
                path: item.path.split("/").slice(0, -1).join("/"),
                sha: item.sha,
                url: item.url,
                children: [],
            };
            parent.children.push(dir);
        }
        return dir;
    };

    for (const item of data) {
        let current = root;
        const path = item.path.split("/");
        
        for (const dir of path.slice(0, -1)) {
            current = findOrCreateDir(current, dir, item);
        }

        if (item.type === "blob") {
            const fileName = item.path.split("/").pop();
            current.children.push({
                type: "file",
                name: fileName,
                path: item.path,
                sha: item.sha,
                size: item.size,
                url: item.url,
            });
        }
    }
    
    res.status(200).json(root);
};

export { getBoardProtocols };