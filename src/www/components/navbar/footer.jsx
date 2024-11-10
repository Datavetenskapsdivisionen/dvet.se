import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth, isEnglish } from "../../util";
import Cookies from "js-cookie";

const footer = () => {
    const nav = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        setLoggedIn(Cookies.get("dv-token") !== undefined);
    }, [loggedIn]);

    useEffect(() => {
        const darkModeCookie = Cookies.get("dv-dark-mode");
        if (darkModeCookie) {
            setDarkMode(darkModeCookie === "true");
            document.documentElement.setAttribute("data-theme", darkModeCookie === "true" ? "dark" : "light");
        } else {
            setDarkMode(false);
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, [darkMode]);

    const logOutButton = loggedIn
        ? <button onClick={() => {
            Cookies.remove("dv-token");
            location.reload();
        }}>Logout</button>
        : <></>;

    return (
        <footer>
            <div className="button-container">
                <button onClick={() => nav("/privacy-policy")}>{isEnglish() ? "Privacy policy" : "Integritetspolicy"}</button>
            </div>
            <span>© dvet.se {new Date().getFullYear()}</span>
            <div className="button-container">
                {logOutButton}
                <button onClick={() => {
                    Cookies.set("dv-dark-mode", !darkMode);
                    location.reload();
                }}>{darkMode ? (isEnglish() ? "Light mode" : "Ljust läge") : (isEnglish() ? "Dark mode" : "Mörkt läge")}</button>
                <button onClick={() => {
                    Cookies.remove("language");
                    location.reload();
                }}>Language</button>
            </div>
        </footer>
    );
};

export default footer;
