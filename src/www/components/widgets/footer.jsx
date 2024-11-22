import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth, isEnglish } from "../../util";
import Cookies from "js-cookie";

const footer = () => {
    const nav = useNavigate();
    const [loggedIn, setLoggedIn] = useState(Cookies.get("dv-token") !== undefined);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {        
        const darkModeCookie = Cookies.get("dv-dark-mode");
        if (darkModeCookie) {
            document.documentElement.setAttribute("data-theme", darkModeCookie === "true" ? "dark" : "light");
            setDarkMode(darkModeCookie === "true");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            setDarkMode(false);
        }
    }, []);

    if (!loggedIn && Cookies.get("dv-token") !== undefined) {
        setLoggedIn(true);
    }

    const onDarkModeToggle = () => {
        Cookies.set("dv-dark-mode", !darkMode, { expires: 364 });
        document.documentElement.setAttribute("data-theme", !darkMode ? "dark" : "light");
        setDarkMode(!darkMode);
    };

    const logOutButton = loggedIn
        ? <button onClick={() => {
            Cookies.remove("dv-token");
            location.reload();
        }}>{isEnglish() ? "Logout" : "Logga ut"}</button>
        : <></>;

    return (
        <footer>
            <div className="button-container">
                <button onClick={() => nav("/privacy-policy")}>{isEnglish() ? "Privacy policy" : "Integritetspolicy"}</button>
            </div>
            <span>© dvet.se {new Date().getFullYear()}</span>
            <div className="button-container">
                {logOutButton}
                <button onClick={onDarkModeToggle}>{darkMode ? (isEnglish() ? "Light mode" : "Ljust läge") : (isEnglish() ? "Dark mode" : "Mörkt läge")}</button>
                <button onClick={() => {
                    Cookies.set("language", isEnglish() ? "se" : "en", { expires: 364 });
                    location.reload();
                }}>{isEnglish() ? "Svenska" : "English"}</button>
            </div>
        </footer>
    );
};

export default footer;
