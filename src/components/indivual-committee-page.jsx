import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

rehypeRaw({ allowDangerousHtml: true });

const me = (props) => {
    return <div className="page">
        <ReactMarkdown children={props.text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
        </ReactMarkdown>
    </div>;
};

export default me;