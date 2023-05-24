import React from "react";

const me = (props) => (
    <button onClick={() => window.open(props.uri, "_self")}>
        <img src={props.image} />
        {props.name}
    </button>);

export default me;