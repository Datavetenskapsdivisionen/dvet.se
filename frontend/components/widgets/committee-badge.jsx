import React from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

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

const me = (props) => {
    const nav = useNavigate();
    const clickAction = props.uri ? () => { nav(props.uri); window.scrollTo(0, 0); } : () => window.open(props.link);

    let textholder = "text-holder"
    let imageholder = "image-holder"
    if (props.DVops === true){
        textholder += " dvOps-holder"
        imageholder += " dvOps-holder"
    }
    if (props.Concats === true){
        textholder += " concats-holder"
        imageholder += " concats-holder"
    }

    return <div className="committee-badge" style={style(props.color)} onClick={clickAction}>
        <div className= {imageholder}>
            <img src={props.logo} alt="I am an image" draggable="false" />
        </div>
        <div className={textholder}>
            {text(props.imageText, props.name, props.fontSize)}
        </div>
        <ReactMarkdown></ReactMarkdown>
    </div >;
};

export default me;