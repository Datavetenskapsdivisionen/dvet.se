import React from "react";
import { useSearchParams } from "react-router-dom";
import { Schedule } from "components/widgets/schedule";

const Types = {
    KANDIDAT: "kandidat",
    MASTER: "master",
    DEFAULT: ""
};

const fetchSchedule = ({ type = Types.DEFAULT, limit = 6, title = "" }) => {
    const t = title ? <h1>{title}</h1> : <></>;
    switch (type) {
        case Types.KANDIDAT:
        case Types.MASTER:
            return <>{t} <Schedule eventLimit={limit} eventUrl={`/api/kickoff-events?type=${type}`} /></>;
        default:
            return <>{t} <Schedule eventLimit={limit} /></>;
    }
};

const me = () => {
    const params = useSearchParams();
    const [schedule, setSchedule] = React.useState(<Schedule />);

    React.useEffect(() => {
        const type = params[0].get("type");
        const limit = params[0].get("limit");
        const title = params[0].get("title");
        switch (type) {
            case Types.KANDIDAT:
            case Types.MASTER:
                setSchedule(fetchSchedule({ type, limit, title }));
                break;
            default:
                setSchedule(fetchSchedule({ limit, title }));
        }
    }, []);

    return (
        <div className="page">
            <style>{`
                .upcoming-button { display: none !important; }
                .info-tag { display: none !important; }
                .schedule-holder { margin: auto; max-width: 60vw; }
            `}</style>
            {schedule}
        </div>
    );
};

export default me;