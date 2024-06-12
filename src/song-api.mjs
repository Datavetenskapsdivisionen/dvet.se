import fs from "fs/promises";
import { parse } from "marked";

const SONG_PATH = "content/wiki/Sittningsvisor";

let data = {};
let lastTime = new Date("December 17, 1995 03:24:00");
const getData = async () => {
    const diff = Math.abs(new Date() - lastTime);
    const minutes = (diff / 1000) / 60;
    if (minutes < 1) {
        lastTime = new Date();
        return;
    }
    data = {};
    const songs = await fs.readdir(SONG_PATH);

    const parsed = await Promise.all(songs.map(async (song) => {
        const songPath = `${SONG_PATH}/${song}`;
        const contents = await fs.readFile(songPath, 'utf8');
        const res = await parse(contents);
        return [song.replace(/\.[^/.]+$/, ""), res];
    }));

    for (const [song, content] of parsed) {
        data[song] = [content];
    }
};

const me = async (req, res) => {
    await getData();

    res.json(data);
};

export default me;