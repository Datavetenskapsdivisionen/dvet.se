import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "../../../content/committees/dvrk/dvrk.md";
import contact from "../../../content/committees/dvrk/dvrkcontact.md";
import textEn from "../../../content/committees/dvrk/dvrk-en.md";
import contactEn from "../../../content/committees/dvrk/dvrkcontact-en.md";
import Schedule from "./widgets/schedule";
import "./../dvrk-styles.less";
import { Route, Link, useNavigate } from "react-router-dom";
import DVRKLogo from "../../../assets/committee-logos/dvrk-logo.png";
import DURKMAN from "../../../assets/dvrk.png";
const DURKMAN_URL = "url(" + new String(DURKMAN) + ")";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { isEnglish } from "../util";

const documentOptions = [
    {
        label: <span>{isEnglish() ? "Bachelor" : "Kandidat"}</span>,
        value: "/committees/dvrk/bachelor"
    },
    {
        label: <span>Master</span>,
        value: "/committees/dvrk/master"
    }
];
const scheduleOptions = [
    {
        label: <span>{isEnglish() ? "Bachelor" : "Kandidat"}</span>,
        value: "/committees/dvrk/schedule/bachelor"
    },
    {
        label: <span>Master</span>,
        value: "/committees/dvrk/schedule/master"
    }
];
const DVRKbar = () => {
    const nav = useNavigate();
    const clickAction = (uri) => { nav(uri); window.scrollTo(0, 0); };
    let placeholderLanguage = isEnglish() ? "english" : "swedish";
    let documentDropdown = <Dropdown
        className="nav__dropdown_parent"
        controlClassName="nav__dropdown"
        placeholderClassName={"placeholder placeholder-document document-" + placeholderLanguage}
        options={documentOptions}
        onChange={v => { clickAction(v.value); }}
        // Edit this in the styles.less file instead (.placeholder::after),
        // this hack is done to avoid showing selected value in the dropdown.
        placeholder={<span>Dokument</span>}
    />;
    let scheduleDropdown = <Dropdown
        className="nav__dropdown_parent"
        controlClassName="nav__dropdown"
        placeholderClassName={"placeholder placeholder-schedule schedule-" + placeholderLanguage}
        options={scheduleOptions}
        onChange={v => { window.open(v.value, "_self"); }}
        // Edit this in the styles.less file instead (.placeholder::after),
        // this hack is done to avoid showing selected value in the dropdown.
        placeholder={<span>Dokument</span>}
    />;
    return <>
        <header className="dvrk-header" style={{ backgroundImage: DURKMAN_URL }}>
            <div className="header-text">
                <img draggable="false" src={DVRKLogo} />
            </div>
        </header>
        <nav className="dvrk-nav">
            <div>
                <Link className="nav__link" to="/committees/dvrk">
                    {isEnglish() ? "Home" : "Hem"}
                </Link>
                {scheduleDropdown}
                <Link className="nav__link" to="/committees/dvrk/contact">
                    {isEnglish() ? "Contact" : "Kontakt"}
                </Link>
                <Link className="nav__link" to="/committees/dvrk/form">
                    {isEnglish() ? "Form" : "Formulär"}
                </Link>
                {documentDropdown}
                <Link className="nav__link" to="/">
                    {isEnglish() ? "Back" : "Tillbaka"}
                </Link>
            </div>
        </nav></>;
};

const MainPage = () => (
    <>
        {/* <Schedule eventUrl="/getKickOffEvents" restUrl="/committees/dvrk/schedule" /> */}
        <ReactMarkdown children={isEnglish() ? textEn : text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </>
);

const ContactPage = () => (
    <>
        <ReactMarkdown children={isEnglish() ? contactEn : contact} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
    </>
);

const SchedulePage = (props) => (
    <>
        <h1>{props.title ?? "Schedule"}</h1>
        <Schedule full={true} eventUrl={"/getKickoffEvents" + (props.extension ?? "")} />
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
            style={{
                width: "100%",
                height: "90vh",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
            }}
            scrolling="yes"
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
        <Route exact path="/committees/dvrk/schedule/bachelor" element={
            <ContentHolder element={
                <SchedulePage extension="?type=Kandidat" title={isEnglish() ? "Bachelor schedule" : "Kandidat schema"} />
            } />
        } />
        <Route exact path="/committees/dvrk/schedule/master" element={
            <ContentHolder element={
                <SchedulePage extension="?type=Master" title="Master schedule" />
            } />
        } />
        <Route exact path="/committees/dvrk/contact" element={
            <ContentHolder element={<ContactPage />} />
        } />
        <Route exact path="/committees/dvrk/form" element={
            <ContentHolder element={
                <IframePage
                    url="https://drive.google.com/file/d/1ZwFMOY8R5qs2EAfeGlwL2mN0aHnqT21E/preview"
                    title={isEnglish() ? "Phaddergroup form!" : "Phaddergrupp formulär!"}
                />
            } />
        } />
        <Route exact path="/committees/dvrk/bachelor" element={
            <ContentHolder element={
                <IframePage
                    url="/recceguiden"
                    title={isEnglish() ? "Receptionguide for bachelor students!" : "Recceguiden för kandidater!"}
                />
            } />
        } />
        <Route exact path="/committees/dvrk/master" element={
            <ContentHolder element={
                <IframePage
                    url="/masterguide"
                    title="Receptionguide for master students!"
                />
            } />
        } />
    </Route>
);


export default dvrkRoute;
