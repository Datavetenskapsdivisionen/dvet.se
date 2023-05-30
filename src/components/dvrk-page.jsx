import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "../../Content/committees/dvrk.md";
import KickoffSchedule from "./widgets/kickoff-schedule";

const me = () => (
    <div className="page">
        <KickoffSchedule />
        <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </div>
);

export default me;
