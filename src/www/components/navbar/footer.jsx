import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuth } from "../../util";
import Cookies from "js-cookie";

const footer = () => {
    let [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        const eff = async () => setLoggedIn(await isAuth());
        eff();
    }, []);

    const logOutButton = loggedIn
        ? <button onClick={() => {
            Cookies.remove("dv-token");
            location.reload();
        }}>Logout</button>
        : <></>;

    return (
        <footer>
            <span />
            <span>© dvet.se {new Date().getFullYear()}</span>
            <div className="button-container">
                {logOutButton}
                <button onClick={() => {
                    Cookies.set("language", "null");
                    location.reload();
                }}>Language</button>
            </div>
        </footer>
    );
};

export default footer;
