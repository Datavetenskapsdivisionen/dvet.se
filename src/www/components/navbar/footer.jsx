import React from "react";
import { Link } from "react-router-dom";

const footer = () => {
    return (
        <footer>
            <div></div>
            <span>© dvet.se {new Date().getFullYear()}</span>
            <div id="google_translate_element"></div>
        </footer>
    );
};

export default footer;
