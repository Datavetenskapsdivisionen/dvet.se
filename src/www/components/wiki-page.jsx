import React, { useEffect, useState } from "react";
//import Page from "/wiki.js";


const me = () => {
    const [Page, setPage] = useState(<></>);
    useEffect(() => {
        const importWiki = async () => {
            await import(/* webpackIgnore: true */"/wiki-data");
            let PageFunc = window.__hacky__wikiPage();
            setPage(<PageFunc />);
        };

        importWiki();
    }, []);

    return <div className="page" style={{
        display: "flex",
        marginTop: "-10px",
        marginBottom: "-10px",
    }}>
        {Page}
    </div>;
};

export default me;