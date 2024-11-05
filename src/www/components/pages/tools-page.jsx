import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "/content/tools-page/tools-page.md";
import textEn from "/content/tools-page/tools-page-en.md";
import { isEnglish } from "/src/www/util";

const me = () => {
  const t = isEnglish() ? textEn : text;
  return <div className="page">
    <ReactMarkdown children={t} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
  </div>;
};

export default me;
