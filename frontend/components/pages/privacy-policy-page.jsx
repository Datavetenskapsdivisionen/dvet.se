import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "/frontend/content/privacy-policy/privacy-policy.md";
import textEn from "/frontend/content/privacy-policy/privacy-policy-en.md";
import { isEnglish } from "util";

const me = () => (
  <div className="page">
    <ReactMarkdown children={isEnglish() ? textEn : text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
  </div>
);

export default me;
