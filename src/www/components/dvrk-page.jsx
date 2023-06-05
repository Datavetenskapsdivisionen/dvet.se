import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "../../../content/committees/dvrk.md";
import KickoffSchedule from "./widgets/kickoff-schedule";
import "./../dvrk-styles.less";
import { Route, Link } from "react-router-dom";
import DVRKLogo from "../../../assets/committee-logos/dvrk-logo.png";
import DURKMAN from "../../../assets/dvrk.jpg";
const DURKMAN_URL = "url(" + new String(DURKMAN) + ")";

const DVRKbar = () => (
    <>
        <header className="dvrk-header" style={{ backgroundImage: DURKMAN_URL }}>
            <div className="header-text">
                <span>DVRK</span>
                <img draggable="false" src={DVRKLogo} />
            </div>
        </header>
        <nav className="dvrk-nav">
            <div>
                <Link className="nav__link" to="/committees/dvrk">
                    DVRK
                </Link>
                <Link className="nav__link" to="/committees/dvrk/schedule">
                    Schema
                </Link>
                <Link className="nav__link" to="/committees/dvrk/contact">
                    Kontakt
                </Link>
                <Link className="nav__link" to="/">
                    Tillbaka
                </Link>
            </div>
        </nav></>
);

const MainPage = () => (
    <>
        <KickoffSchedule />
        <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </>
);

const SchedulePage = () => (
    <>
        <KickoffSchedule />
    </>
);

const InfoPage = () => (
    <>
        <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </>
);

// If you know a better way to do this, plz pull request :)
const ContentHolder = (props) => (
    <>
        <DVRKbar />
        <main>
            <div className="dvrk-page">
                {props.element}
            </div>
        </main>
    </>
);

const dvrkRoute = () => (
    <Route>
        <Route exact path="/committees/dvrk" element={
            <ContentHolder element={<MainPage />} />
        } />
        <Route exact path="/committees/dvrk/schedule" element={
            <ContentHolder element={<SchedulePage />} />
        } />
        <Route exact path="/committees/dvrk/contact" element={
            <ContentHolder element={<InfoPage />} />
        } />
    </Route>
);


export default dvrkRoute;
