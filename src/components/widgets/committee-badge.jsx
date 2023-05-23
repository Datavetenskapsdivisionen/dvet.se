import React from "react";
import ReactMarkdown from "react-markdown";

const text = (img, text, fontSize) => {
    if (img == null) {
        return <h1 style={{ 'fontSize': fontSize }}>{text}</h1>;
    } else {
        return <img src={img} alt="" />;
    }
};

const style = (color) => {
    if (color != null) {
        return { "backgroundColor": color };
    } else {
        return {};
    }
};

const me = (props) => (
    <div className="committee-badge" style={style(props.color)} onClick={() => window.open(props.uri, "_self")}>
        <div className="image-holder">
            <img src={props.logo} alt="I am an image" draggable="false" />
        </div>
        <div className="text-holder">
            {text(props.imageText, props.name, props.fontSize)}
        </div>
        <ReactMarkdown></ReactMarkdown>
    </div >
);

export default me;