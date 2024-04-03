import React from "react";
import { Link } from "react-router-dom";

const footer = () => {
    return (
        <footer>
            <div></div>
            <span>© dvet.se {new Date().getFullYear()}</span>
            <button onClick={() => {
                document.cookie = "language=null; path=/";
                location.reload();
            }}>Switch Language</button>
            {/* <div id="google_translate_element"></div> */}
        </footer>
    );
};

export default footer;
