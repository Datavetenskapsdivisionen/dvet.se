import React from "react";
import ReactMarkdown from "react-markdown";

const me = (props) => (
    <div className="committee-badge">
        <div className="image-holder">
            <img src={props.logo} alt="I am an image" />
        </div>
        <div>
            <h1 style={{ 'fontSize': props.fontSize }}>{props.name}</h1>
        </div>
        <ReactMarkdown></ReactMarkdown>
    </div >
);

export default me;