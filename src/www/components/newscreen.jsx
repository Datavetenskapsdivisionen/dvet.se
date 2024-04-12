import React from "react";
import NewsFeed from "./widgets/newsfeed";

const me = () => (
    <div className="page">
        {/*ugly fix to remove the footer for this page :)*/}
        <style>{`
            footer {
                display: none;
            }
        `}</style>
        <NewsFeed liteVersion={true} />
    </div>
);
export default me;