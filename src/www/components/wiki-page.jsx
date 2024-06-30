import React, { useEffect, useState } from "react";
//import Page from "/wiki.js";

const isModule = (mod) =>
    !((!Object.keys(mod)) || (!!mod.default && typeof module.default === "object" && !Object.keys(module.default).length));

const me = () => {
    const [Page, setPage] = useState(<>Loading...</>);
    useEffect(() => {
        const importWiki = async () => {
            await import(/* webpackIgnore: true */"/wiki.js");
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