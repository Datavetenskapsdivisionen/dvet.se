import React from "react";
import ReactMarkdown from "react-markdown";
import text from "../../Content/Home.md";

const me = () => (
  <div>
    <h1>Home</h1>
    <ReactMarkdown children={text}></ReactMarkdown>
  </div>
);

export default me;
