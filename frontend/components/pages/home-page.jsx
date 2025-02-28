import React from "react";
import KickoffInfoButton from "components/widgets/kickoff-info-button";
import NewsFeed from "components/widgets/newsfeed";
import { Schedule } from "components/widgets/schedule";
import { isReception } from "util";

const me = () => (
    <div className="page">
        <KickoffInfoButton />
        {!isReception()
            ?
            <>
                <h2>
                    Events
                    <button className="calender-button" onClick={() => {
                        window.open("https://calendar.google.com/calendar/embed?src=c_cd70b7365c189248ae5fce47932c65729fb3a0a4052a83b610613f1e6dcfd047%40group.calendar.google.com&ctz=Europe%2FStockholm", "_blank");
                    }}>
                        <span>📅</span>
                    </button>
                </h2>
                <Schedule eventLimit={2} />
            </>
            : <></>}

        <NewsFeed />
    </div>
);

export default me;
