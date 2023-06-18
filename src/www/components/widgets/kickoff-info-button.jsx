import React from "react";
import { useNavigate } from "react-router-dom";
import { isReception } from "../../util";

const me = () => {
    const month = new Date().getMonth() + 1;
    //const action = () => window.open("https://dvrk.dvet.se");
    const nav = useNavigate();
    const action = () => nav("/committees/dvrk");

    return isReception()
        ? <button className="kickoff-info-button" onClick={action}>
            <p>Letar du efter mottagningsinfo?</p>
            <p>Tryck här!</p>
        </button>
        : <></>;
};

export default me;