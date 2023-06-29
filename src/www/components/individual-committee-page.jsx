import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { isEnglish } from "../util";
rehypeRaw({ allowDangerousHtml: true });

const me = (props) => {
    const text = isEnglish() ?
        <ReactMarkdown children={props.textEn} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        :
        <ReactMarkdown children={props.text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        ;

    return <div className="page">
        {text}
    </div>;
};

export default me;