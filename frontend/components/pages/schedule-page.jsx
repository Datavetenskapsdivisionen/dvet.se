import React from "react";
import { Schedule } from "../widgets/schedule";

const SchedulePage = () => {
    return (
        <div className="page">
            <h1>Events</h1>
            <Schedule full={true} />
        </div>
    );
};

export default SchedulePage;