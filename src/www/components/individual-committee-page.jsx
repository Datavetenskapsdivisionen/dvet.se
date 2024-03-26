import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { isEnglish } from "../util";
rehypeRaw({ allowDangerousHtml: true });

const me = (props) => {
    const text = isEnglish() ?
        require(`../../../content/committees/${props.committee}/${props.committee}-en.md`)["default"]
    :
        require(`../../../content/committees/${props.committee}/${props.committee}.md`)["default"];

    return (
        <div className="page">
            <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} />
        </div>
    );
};

export default me;