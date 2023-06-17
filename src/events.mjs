import { authorize } from "./googleApi.mjs";
import { google } from "googleapis";

const getEventsFromSheet = async (auth) => {
    const sheet = google.sheets({ version: "v4", auth: auth });
    const data = await sheet.spreadsheets.values.get({
        spreadsheetId: "1E35HVlMfHw9wKmfgHr982yGe_lIyTQxMhd-jNh2uIOg",
        range: "Formulärsvar 1!A1:L",
    });
    let values = data.data.values;
    let headers = values[0];
    values.shift();
    values = values.map(val => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = val[i]);
        const formattedTime = obj["Day"] + ":" + obj["Time"].replace(".", ":");
        obj.FullTime = Date.parse(formattedTime);
        return obj;
    });
    values.sort((a, b) => a.FullTime - b.FullTime);

    return values;
};

const getKickOffCalender = async (auth) => {
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
        calendarId: "c_18d270d79e0911aa0be7a499c2190b616bbebf8462b3936d67cf4966757db7cb@group.calendar.google.com",
        timeMin: new Date().toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: "startTime",
    });
    const committeeRegex = /\((\w+|[0,9]|\+|å|ä|ö|Å|Ä|Ö| |&|\.|!|\t)+\)( *$)/g;
    const groupRegex = /\[(\w+|[0,9]|\+|å|ä|ö|Å|Ä|Ö| |&|\.|!|\t)+\]/g;
    const events = res.data.items.map(o => {
        // Get the target groups for an event
        o.group = [];
        const groupMatch = o.summary.match(groupRegex);
        if (groupMatch) groupMatch.map(e => o.group.push(e.slice(1, -1)));

        // Get committee, default to DVD if not found
        const summaryMatch = o.summary.match(committeeRegex);
        o.committee = summaryMatch
            ? summaryMatch[0].slice(1, -1)
            : "DVD";
        o.summary = o.summary
            .replaceAll(committeeRegex, "")
            .replaceAll(groupRegex, "");

        // Fix date
        o.dateData = {
            start: new Date(Date.parse(o.start.date ? o.start.date : o.start.dateTime)),
            end: new Date(Date.parse(o.end.date ? o.end.date : o.end.dateTime)),
            isDay: o.start.dateTime == null && o.end.dateTime == null
        };
        delete o.start;
        delete o.end;

        // Clear up unneeded fields 
        delete o.organizer;
        delete o.iCalUID;
        delete o.sequence;
        delete o.reminders;
        delete o.eventType;
        delete o.kind;
        delete o.etag;
        return o;
    });
    return events;
};

let sheetEvents = {};
let kickOffEvents = [];
const syncEvents = async () => {
    if (process.env.ENABLE_DRIVE == "true")
        await authorize().then(async auth => {
            sheetEvents = await getEventsFromSheet(auth);
            kickOffEvents = await getKickOffCalender(auth);
        }).catch(console.error);
};

let lastTime = new Date(Date.parse("2100-01-01"));

const getter = async (req, res, getter) => {
    if (process.env.ENABLE_DRIVE != "true") {
        res.json({ error: "Event API is down!" });
        return;
    }
    const diff = Math.abs(new Date() - lastTime);
    const minutes = (diff / 1000) / 60;
    if (minutes >= 5) {
        lastTime = new Date();
        syncEvents().then(() => res.json(getter()));
    } else res.json(getter());
};

const getSheetEvents = async (req, res) => {
    getter(req, res, () => sheetEvents);
};

const getKickOffEvents = async (req, res) => {
    getter(req, res, () => {
        const query = req.query.type;
        if (query === "bachelor") {
            return kickOffEvents;
        }
        else if (query === "master") {
            return kickOffEvents;
        }
        else return kickOffEvents;
    });
};

export { getSheetEvents, getKickOffEvents };