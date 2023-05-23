import React from "react";
import { Link } from "react-router-dom";

const footer = () => {
    return (
        <footer>
            © dvet.se {new Date().getFullYear()}
        </footer>
    );
};

export default footer;
