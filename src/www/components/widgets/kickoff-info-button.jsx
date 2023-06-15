import React from "react";
import { useNavigate } from "react-router-dom";

const me = () => {
    const month = new Date().getMonth() + 1;
    //const action = () => window.open("https://dvrk.dvet.se");
    const nav = useNavigate();
    const action = () => nav("/committees/dvrk");
    return month >= 6 && month <= 9 ? <button className="kickoff-info-button" onClick={action}>
        <p>Letar du efter mottagningsinfo?</p>
        <p>Tryck här!</p>
    </button> : null;
};

export default me;