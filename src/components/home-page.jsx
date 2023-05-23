import React from "react";
import ReactMarkdown from "react-markdown";
import text from "../../Content/home-page.md";

const me = () => (
  <div className="page">
    <h1>Home</h1>
    <ReactMarkdown children={text}></ReactMarkdown>
  </div>
);

export default me;
