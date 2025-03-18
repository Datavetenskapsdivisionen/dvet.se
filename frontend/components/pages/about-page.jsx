import React from "react";
import ReactMarkdown from "react-markdown";
import text from "/frontend/content/about-page/about-page.md";
import textEn from "/frontend/content/about-page/about-page-en.md";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { isEnglish } from "util";

const me = () => (
  <div className="page">
    <ReactMarkdown children={isEnglish() ? textEn : text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
  </div>
);

export default me;
