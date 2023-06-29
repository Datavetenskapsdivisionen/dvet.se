import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "../../../content/documents-page/documents-page.md";
import textEn from "../../../content/documents-page/documents-page-en.md";
import { isEnglish } from "../util";

const me = () => (
  <div className="page">
    <ReactMarkdown children={isEnglish() ? textEn : text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
  </div>
);

export default me;
