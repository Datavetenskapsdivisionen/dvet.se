import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "../../../content/committees/dvrk.md";
import KickoffSchedule from "./widgets/kickoff-schedule";
import "./../dvrk-styles.less";
import { Route, Link, useNavigate } from "react-router-dom";
import DVRKLogo from "../../../assets/committee-logos/dvrk-logo.png";
import DURKMAN from "../../../assets/dvrk.jpg";
const DURKMAN_URL = "url(" + new String(DURKMAN) + ")";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const options = [
    {
        label: <span>Kandidat</span>,
        value: "/committees/dvrk/bachelor"
    },
    {
        label: <span>Master</span>,
        value: "/committees/dvrk/master"
    }
];
const DVRKbar = () => {
    const nav = useNavigate();
    const clickAction = (uri) => { nav(uri); window.scrollTo(0, 0); };
    let dropdown = <Dropdown
        className="nav__dropdown_parent"
        controlClassName="nav__dropdown"
        placeholderClassName="placeholder"
        options={options}
        onChange={v => { clickAction(v.value); }}
        // Edit this in the styles.less file instead (.placeholder::after),
        // this hack is done to avoid showing selected value in the dropdown.
        placeholder={<span>Dokument</span>}
    />;
    return <>
        <header className="dvrk-header" style={{ backgroundImage: DURKMAN_URL }}>
            <div className="header-text">
                <span>DVRK</span>
                <img draggable="false" src={DVRKLogo} />
            </div>
        </header>
        <nav className="dvrk-nav">
            <div>
                <Link className="nav__link" to="/committees/dvrk">
                    Hem
                </Link>
                <Link className="nav__link" to="/committees/dvrk/schedule">
                    Schema
                </Link>
                <Link className="nav__link" to="/committees/dvrk/contact">
                    Kontakt
                </Link>
                <Link className="nav__link" to="/committees/dvrk/form">
                    Formulär
                </Link>
                {dropdown}
                <Link className="nav__link" to="/">
                    Tillbaka
                </Link>
            </div>
        </nav></>;
};

const MainPage = () => (
    <>
        <KickoffSchedule />
        <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </>
);

const SchedulePage = () => (
    <>
        <KickoffSchedule full={true} />
    </>
);

const InfoPage = () => (
    <>
        <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </>
);

const IframePage = (props) => (
    <>
        <h1>{props.title}</h1>
        <iframe
            src={props.url}
            frameborder="0"
            style={{ width: "100%", height: "512px" }}
        >
        </iframe>
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
        <Route exact path="/committees/dvrk/form" element={
            <ContentHolder element={
                <IframePage
                    url="https://drive.google.com/file/d/1ZwFMOY8R5qs2EAfeGlwL2mN0aHnqT21E/preview"
                    title="Faddergrupp formulär!"
                />
            } />
        } />
        <Route exact path="/committees/dvrk/bachelor" element={
            <ContentHolder element={
                <IframePage
                    url="https://drive.google.com/file/d/1ZwFMOY8R5qs2EAfeGlwL2mN0aHnqT21E/preview"
                    title="Recceguiden för kandidater!"
                />
            } />
        } />
        <Route exact path="/committees/dvrk/master" element={
            <ContentHolder element={
                <IframePage
                    url="https://drive.google.com/file/d/1ZwFMOY8R5qs2EAfeGlwL2mN0aHnqT21E/preview"
                    title="Receptionguide for master students!"
                />
            } />
        } />
    </Route>
);


export default dvrkRoute;
