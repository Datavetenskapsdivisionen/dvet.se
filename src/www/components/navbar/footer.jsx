import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth, isEnglish } from "../../util";
import Cookies from "js-cookie";

const footer = () => {
    const nav = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

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
            <div className="button-container">
                <button onClick={() => nav("/privacy-policy")}>{isEnglish() ? "Privacy policy" : "Integritetspolicy"}</button>
            </div>
            <span>© dvet.se {new Date().getFullYear()}</span>
            <div className="button-container right">
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
