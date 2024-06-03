import React from "react";
import Page from "../../../dist/wiki.html";

const me = () => <div dangerouslySetInnerHTML={{ __html: Page }}></div>;

export default me;