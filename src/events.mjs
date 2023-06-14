import { authorize } from "./googleApi.mjs";
import { google } from "googleapis";

const EVENTS = "1E35HVlMfHw9wKmfgHr982yGe_lIyTQxMhd-jNh2uIOg";

const listFields = async (authClient) => {
    const sheet = google.sheets({ version: "v4", auth: authClient });
    const res = await sheet.spreadsheets.values.get({
        spreadsheetId: EVENTS,
        range: "Formulärsvar 1!A1:L",
    });
    return res;
};

const getEvents = async () => authorize().then(async c => {
    const data = await listFields(c);
    let values = data.data.values;
    let headers = values[0];
    values.shift();
    values = values.map(val => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = val[i]);
        const formattedTime = obj["Day"] + ":" + obj["Time"].replace(".", ":");
        //console.log(formattedTime + ": " + Date.parse(formattedTime));
        obj.FullTime = Date.parse(formattedTime);
        return obj;
    });
    values.sort((a, b) => a.FullTime - b.FullTime);

    return values;
}).catch(console.error);

let events = {};
const syncEvents = async () => {
    authorize().then(async c => {
        const data = await getEvents();
        events = data;
    }).catch(console.error);
};
await syncEvents();

let lastTime = new Date();
const me = async (req, res) => {
    if (process.env.ENABLE_DRIVE != "true") {
        res.json({ error: "Event API is down!" });
        return;
    }
    const diff = Math.abs(new Date() - lastTime);
    const minutes = (diff / 1000) / 60;
    if (minutes >= 5) {
        lastTime = new Date();
        await syncEvents();
    }
    res.json(events);
};
export default me;