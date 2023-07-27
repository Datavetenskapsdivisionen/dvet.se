import React from "react";
import Schedule from "./widgets/schedule";

const me = () => (
    <div className="page" style={{ display: "flex", justifyContent: "center" }}>
        {/*ugly fix to remove the footer for this page :)*/}
        <style>{`
            footer {
                display: none;
            }
        `}</style>
        <Schedule />
    </div>
);
export default me;