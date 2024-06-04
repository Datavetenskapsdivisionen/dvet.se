import React from "react";
import Page from "../../../dist/wiki/main.html";

const me = () => <div className="page" dangerouslySetInnerHTML={{ __html: Page }}></div>;

export default me;