import React from "react";
import ReactMarkdown from "react-markdown";
import text from "../../../content/about-page.md";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const me = () => (
  <div className="page">
    <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
  </div>
);

export default me;
