import React from "react";
import { Outlet } from "react-router-dom";
import { isEnglish } from "/frontend/util";

import Toolbar from "./toolbar";
import Navbar from "./navbar";
import Footer from "./footer";

const NotFoundPage = () => {
    const textSe = "Sidan du försökte nå kunde inte hittas. Om du misstänker att detta är ett fel, vänligen skicka oss ett mail via ";
    const textEn = "The page you tried to reach could not be found. If you believe this is a mistake, please send us an email at ";
    return (
        <div className="page">
            <h1>404</h1>
            <p>{isEnglish() ? textEn : textSe} <a href="mailto:styrelsen@dvet.se">styrelsen@dvet.se</a>.</p>
        </div>
    );
};
  
const Layout = (props) => {
    return (
        <div>
            <Toolbar />
            <Navbar />
            <main>
                {props.error ? <NotFoundPage /> : <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;