import __sql from 'sqlite3';
import { verifyCookie } from './auth.mjs';
const sqlite3 = __sql.verbose();
import randomUnicodeEmoji from 'random-unicode-emoji';

Array.prototype.intersperse = function (s) {
    return this.reduce((p, c, i) => (p[2 * i] = c, p), new Array(2 * this.length - 1).fill(s));
};

const db = new sqlite3.Database(':memory:');
db.asyncAll = (sqlStatement, params, f) => new Promise((resolve, reject) => {
    db.all(sqlStatement, params, (err, rows) => {
        if (err) {
            reject(err);
        }
        resolve(rows.map((row) => f(err, row)));
    });
});

db.serializeAsync = (f) => new Promise((resolve, reject) => {
    db.serialize(() => {
        let r = f();
        resolve(r);
    });
});
const linkTable = "links";
const linkContent = `
    id TEXT PRIMARY KEY,
    link TEXT NOT NULL,
    creator TEXT NOT NULL,
    clicks INTEGER NOT NULL,
    date TEXT NOT NULL`;

await db.serializeAsync(async () => {
    db.run(`CREATE TABLE ${linkTable} (${linkContent})`);
});

const fetchLinks = async () => {
    let res = await db.serializeAsync(async () => {
        let res = [];
        await db.asyncAll(`SELECT id, link, creator, clicks, date FROM ${linkTable}`, [], (err, row) => {
            res.push(row);
        });
        return res;
    });
    return res;
};
const addUrl = async (url, email) => {
    if (!url.startsWith("http://") && !url.startsWith("https://"))
        url = "https://" + url;

    let pre = new Promise((resolve, reject) => {
        db.serializeAsync(async () => {
            const stmt = db.prepare(`INSERT INTO ${linkTable} (id, link, creator, clicks, date) VALUES (?, ?, ?, ?, ?)`);
            let id = encodeURI(randomUnicodeEmoji.random({ count: 4 }).join(""));
            stmt.run([id, url, email, 0, new Date().toString()], function (err) {
                if (null == err) {
                    resolve(id);
                } else {
                    console.error(err);
                }
            });
            stmt.finalize();
        });
    });
    return await pre;
};
const addClick = (id) => db.serialize(async () => {
    db.serialize(async () => {
        let st = db.prepare(`UPDATE ${linkTable} SET clicks = clicks + 1 WHERE id = ?`);
        st.run(id);
        st.finalize();
    });
});

await addUrl("google.com", "cool@dvet.se");

const linkShortenerRed = async (req, res) => {
    res.json(await fetchLinks());
};
const linkShortenerGet = async (req, res) => {
    let id = req.params["id"];

    console.log("start: " + encodeURI(id));

    let pre = new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(`SELECT link FROM ${linkTable} WHERE id = ?`, [id],
                function (err, row) {
                    console.log(row);

                    if (err) {
                        console.error(err);
                        resolve("/");
                    } else {
                        addClick(id);
                        resolve(row.link);
                    }
                });
        });
    });
    let a = await pre;
    console.log("redirect: " + a);
    res.redirect(a);
};
const linkShortenerPost = async (req, res) => {
    let jwt = await verifyCookie(req.headers.cookie);
    if (jwt.error) {
        res.json({ error: jwt.error });
        return;
    }
    let id = await addUrl(req.body.val, jwt.payload.email);
    res.json({ response: `http://localhost:8080/link/${id}` });
};
export { linkShortenerRed, linkShortenerGet, linkShortenerPost };