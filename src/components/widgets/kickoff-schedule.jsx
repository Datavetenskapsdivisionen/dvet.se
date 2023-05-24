import React from "react";
import csvFile from "../../../Content/kickoff-schedule.csv";
import csv from "csvtojson";

const isToday = (date) => {
    const today = new Date();
    return date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();
};

const hasPassed = (date) => (date < new Date());

const getCsvObject = async () => {
    const res = await csv().fromString(csvFile);
    const data = res.map(o => {
        const date = new Date(Date.parse(o["Datum"]));
        let className = "schedule-item";
        if (isToday(date)) {
            className += " active";
        } else if (hasPassed(date)) {
            className += " passed hidden";
        } else {
            className += " upcoming";
        }
        return <div className={className}>
            <h3>{o["Datum"]}</h3>
            <h3>{o["Aktivitet"]}</h3>
            <h4>{o["Arrangör"]}</h4>
            <h4>{o["beskrivning"]}</h4>
        </div>;
    });
    return <div className="kickoff-schedule">{data}</div>;
};

let oldVisible = false;

const me = (props) => {
    const [csv, setState] = React.useState(0);
    React.useEffect(() => {
        getCsvObject().then((res) => setState(res));
    }, [getCsvObject]);
    return <div class="schedule-holder">
        <button onClick={() => {
            const events = Array.from(document.getElementsByClassName("passed"));
            if (!oldVisible) {
                events.forEach(x => x.classList.remove("hidden"));
                oldVisible = true;
            }
            else {
                events.forEach(x => x.classList.add("hidden"));
                oldVisible = false;
            }
        }}>Toggla tidigare event</button>
        {csv}
    </div>;
};

export default me;