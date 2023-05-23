import React from "react";
import text from "../../Content/Home.md";
import ReactMarkdown from "react-markdown";

const me = () => (
  <div>
    <h1>Documents</h1>
    <ReactMarkdown children={text}></ReactMarkdown>
  </div>
);

export default me;
