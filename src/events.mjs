import { authorize } from "./googleApi.mjs";
import { google } from "googleapis";

const getKickOffCalender = async (auth, calenderId) => {
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
        calendarId: calenderId,
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

let kickOffEvents = [];
const syncEvents = async (calenderId) => {
    if (process.env.ENABLE_DRIVE == "true")
        await authorize().then(async auth => {
            kickOffEvents = await getKickOffCalender(auth, calenderId);
        }).catch(console.error);
};

let lastTime = new Date(Date.parse("2100-01-01"));

const getter = async (req, res, calendarId, getter) => {
    if (process.env.ENABLE_DRIVE != "true") {
        res.json({ error: "Event API is down!" });
        return;
    }
    const diff = Math.abs(new Date() - lastTime);
    const minutes = (diff / 1000) / 60;
    if (minutes >= 5) {
        lastTime = new Date();
        syncEvents(calendarId).then(() => res.json(getter()));
    } else res.json(getter());
};

const getKickOffEvents = async (req, res) => {
    getter(req, res,
        "c_18d270d79e0911aa0be7a499c2190b616bbebf8462b3936d67cf4966757db7cb@group.calendar.google.com",
        () => {
            const query = req.query.type;
            if (query) {
                return kickOffEvents.filter(
                    e => e.group.includes(query)
                        || e.group.length == 0
                );
            }
            else return kickOffEvents;
        });
};

export { getKickOffEvents };