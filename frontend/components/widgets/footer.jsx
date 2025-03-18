import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth, isEnglish } from "../../util";
import Cookies from "js-cookie";

const footer = () => {
    const nav = useNavigate();
    const [loggedIn, setLoggedIn] = useState(Cookies.get("dv-token") !== undefined);
    const [darkMode, setDarkMode] = useState(false);
    const [showLogoutOptions, setShowLogoutOptions] = useState(false);

    useEffect(() => {        
        const darkModeCookie = Cookies.get("dv-dark-mode");
        if (darkModeCookie) {
            document.documentElement.setAttribute("data-theme", darkModeCookie === "true" ? "dark" : "light");
            setDarkMode(darkModeCookie === "true");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            setDarkMode(false);
        }

        const handleClickOutside = (event) => {
            if (event.target.className === "logout" || event.target.closest(".logout-options")) { return; }
            setShowLogoutOptions(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!loggedIn && Cookies.get("dv-token") !== undefined) {
        setLoggedIn(true);
    }

    const onDarkModeToggle = () => {
        Cookies.set("dv-dark-mode", !darkMode, { expires: 364 });
        document.documentElement.setAttribute("data-theme", !darkMode ? "dark" : "light");
        setDarkMode(!darkMode);
    };

    const onLogoutClick = (status) => {
        if (status.google) {
            Cookies.remove("dv-token");
        }

        if (status.github) {
            Cookies.remove("dv-github-user");
            fetch("/api/github-auth/logout", { method: "POST" }).then(() => location.reload());
        } else {
            location.reload();
        }
    };

    const LogoutButton = () => {
        const dvTokenCookie = Cookies.get("dv-token");
        const githubTokenCookie = Cookies.get("dv-github-user");

        if (!dvTokenCookie && !githubTokenCookie) { return <></>; }

        return <button className="logout" onClick={() => setShowLogoutOptions(!showLogoutOptions)}>
            { showLogoutOptions
                ? isEnglish() ? "Logout ▴" : "Logga ut ▴"
                : isEnglish() ? "Logout ▾" : "Logga ut ▾" }
        </button>;
    };

    const LogoutOptions = () => {
        if (!showLogoutOptions) { return <></>; }

        const dvTokenCookie = Cookies.get("dv-token");
        const githubTokenCookie = Cookies.get("dv-github-user");

        return <div className="logout-options">
            { dvTokenCookie && <button onClick={() => onLogoutClick({ google: true })}>
                { isEnglish() ? "Logout Google" : "Logga ut Google" }
            </button> }
            { githubTokenCookie && <button onClick={() => onLogoutClick({ github: true })}>
                { isEnglish() ? "Logout GitHub" : "Logga ut GitHub" }
            </button> }
            { dvTokenCookie && githubTokenCookie && <button onClick={() => onLogoutClick({ google: true, github: true })}>
                { isEnglish() ? "Logout all" : "Logga ut alla" }
            </button> }
        </div>
    };

    return (
        <footer>
            <div className="button-container">
                <button onClick={() => nav("/privacy-policy")}>{isEnglish() ? "Privacy policy" : "Integritetspolicy"}</button>
            </div>
            <span>© dvet.se {new Date().getFullYear()}</span>
            <div className="button-container">
                <LogoutOptions />
                <LogoutButton />
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
