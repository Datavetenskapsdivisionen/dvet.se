import React, { Suspense, lazy } from "react";
import Toolbar from "./components/widgets/toolbar";
import "./styles/styles.less";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./components/widgets/navbar";
import Footer from "./components/widgets/footer";
import ContactPage from "./components/pages/contact-page";
import DVRK from "./components/pages/dvrk-page";
import AboutPage from "./components/pages/about-page";
import HomePage from "./components/pages/home-page";
import CommitteesPage from "./components/pages/committees-page";
import PhotosPage from "./components/pages/photos-page";
import WikiPage from "./components/pages/wiki-page";
import { Schedule } from "./components/widgets/schedule";
import PrivacyPolicy from "./components/pages/privacy-policy-page";
import InfoScreen from "./components/pages/info-screen";
import EditInfoScreen from "./components/pages/info-screen-edit-page";
import PhotoHostScreen from "./components/pages/photo-host-page";
import InvoiceGenerator from "./components/pages/invoice-generator-page";
import NewsScreen from "./components/pages/news-screen-page";
import ScheduleScreen from "./components/pages/schedule-screen-page";
import Popo from "./components/widgets/popo";
import FaqPage from "./components/pages/faq-page";
import IndividualCommitteePage from "./components/pages/individual-committee-page";
import { getLanguageCookie, isEnglish } from "./util";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import Loading from "./components/widgets/loading";
import Fire from "/frontend/assets/fire.gif";

const GoogleAuth = () => {
  const [token, setToken] = React.useState(Cookies.get("dv-token"));
  const [isLoggedIn, setIsLoggedIn] = React.useState(null);

  // Log in with token if it exists
  React.useEffect(() => {
    if (token) {
      fetch("/api/verify-token", { method: "POST", headers: { "Authorization": `Bearer ${token}` } })
        .then(res => setIsLoggedIn(res.ok))
        .catch(setIsLoggedIn(false));
    }
  }, [token]);

  const onSuccess = async (res) => {
    if (res.credential) {
      await fetch("/api/google-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(res), referrerPolicy: 'strict-origin-when-cross-origin' })
        .then(res => setIsLoggedIn(res.ok))
        .catch(setIsLoggedIn(false));
    }
  };

  return <GoogleOAuthProvider clientId="420624855220-dad51rlh0qhf2p0fco7s37h685clivps">
    {(isLoggedIn && <Outlet />) ?? (<div className="auth">
      <Popo />
      <img src={Fire} />
      <div>
        <h1>{isEnglish()
          ? "Stop right there, criminal scum!"
          : "Stanna där, kriminella avskum!"}
        </h1>
        <GoogleLogin onSuccess={onSuccess} onError={() => setIsLoggedIn(false)} theme={Cookies.get("dv-dark-mode") === "true" ? "filled_black" : "outline"} locale={isEnglish() ? "en_GB" : "sv_SE"} />
        <p>{isEnglish()
          ? <>The page you are trying to view requires authentication.<br />Please log in with your <code>@dvet.se</code> mail!</>
          : <>Sidan du försöker komma åt kräver inlogg.<br />Logga in med din <code>@dvet.se</code> mail!</>
        }</p>
      </div>
      <img src={Fire} />
    </div>)}
  </GoogleOAuthProvider>;
};

const GithubAuth = () => {
  const githubToken = Cookies.get("dv-github-user");

  React.useEffect(() => { githubToken && window.close(); }, []);

  return <div className="page">
    { githubToken
      ? <><h1>Authorised!</h1><p>You can now close this window.</p></>
      : <p>Authorisation failed.</p>
    }
  </div>;
};

const LanguageSelector = () => {
  const [prefersDarkMode, setPrefersDarkMode] = React.useState(Cookies.get("dv-dark-mode") === "true");

  React.useEffect(() => {
    if (Cookies.get("dv-dark-mode") === undefined) {
      const systemThemePrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setPrefersDarkMode(systemThemePrefersDark);
      Cookies.set("dv-dark-mode", systemThemePrefersDark, { expires: 364 });
    }
  }, []);

  const onDarkModeSwitch = () => {
    Cookies.set("dv-dark-mode", !prefersDarkMode, { expires: 364 });
    setPrefersDarkMode(!prefersDarkMode);
  };

  return <main>
    <div className="language-picker page">
      <h1>Hi - language selection!</h1>
      <p>Before you can proceed we have to ask you which language you prefer!</p>
      <form id="language-form">
        <input type="radio" name="language" id="language-se" defaultChecked={true} />
        <label htmlFor="language-se">Svenska</label>
        <br />
        <input type="radio" name="language" id="language-en" />
        <label htmlFor="language-en">English</label>
        <br /><br />
        <div>
          <label className="switch">
            <input name="shuffle" type="checkbox" checked={prefersDarkMode} onChange={onDarkModeSwitch} />
            <span className="slider" />
          </label>
          <span>Enable dark mode</span>
        </div>
        <br />
        <i>By clicking <b>Ok</b>, you agree to our <a href="/privacy-policy?lang=en" target="_blank">privacy policy</a>.</i>
        <br /><br />
      </form>
      <button className="kickoff-info-button" onClick={() => {
        let english = document.getElementById("language-en");
        Cookies.set("language", english.checked ? "en" : "se", { expires: 364 });
        window.location.reload();
      }}>Ok</button>
    </div>
  </main>;
};

const SchedulePage = () => {
  return (
    <div className="page">
      <h1>Events</h1>
      <Schedule full={true} />
    </div>
  );
};

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
ContactPage;
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

const router = createBrowserRouter([
  {
    element: <Layout />, errorElement: <Layout error />, children: [
      { path: "/", element: <HomePage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/committees", element: <CommitteesPage /> },
      { path: "/faq", element: <FaqPage /> },
      { path: "/photos", element: <PhotosPage /> },
      { path: "/schedule", element: <SchedulePage /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      {
        path: "/dviki", element: <WikiPage />, children: [
          { path: ":id/*", element: <WikiPage /> }
        ]
      },
      { path: "/committees/the-board", element: <IndividualCommitteePage committee={"the-board"} /> },
      { path: "/committees/student-educational-committee", element: <IndividualCommitteePage committee={"student-educational-committee"} /> },
      { path: "/committees/mega6", element: <IndividualCommitteePage committee={"mega6"} /> },
      { path: "/committees/concats", element: <IndividualCommitteePage committee={"concats"} /> },
      { path: "/committees/femmepp", element: <IndividualCommitteePage committee={"femmepp"} /> },
      { path: "/committees/dv_ops", element: <IndividualCommitteePage committee={"dv_ops"} /> },
      { path: "/committees/dvarm", element: <IndividualCommitteePage committee={"dvarm"} /> },
      { path: "/committees/mega7", element: <IndividualCommitteePage committee={"mega7"} /> },

      {
        element: <GoogleAuth />, children: [
          { path: "/info-screen/edit", element: <EditInfoScreen />, loader: async () => await fetch("/api/info-screen") },
          { path: "/photos/host", element: <PhotoHostScreen /> },
          {
            path: "/dviki/Hemlisar", element: <WikiPage />, children: [
              { path: ":id/*", element: <WikiPage /> }
            ]
          },
          { path: "/styrelsen/invoice-generator", element: <InvoiceGenerator /> }
        ]
      }
    ]
  },
  { path: "/github-auth/authorised", element: <GithubAuth /> },
  { path: "/info-screen", element: <InfoScreen />, loader: async () => await fetch("/api/info-screen") },
  { path: "/newsscreen", element: <NewsScreen /> },
  { path: "/scscreen", element: <ScheduleScreen /> },

  { path: "/committees/dvrk", element: <DVRK.MainPage /> },
  { path: "/committees/dvrk/schedule", element: <DVRK.SchedulePage /> },
  { path: "/committees/dvrk/schedule/bachelor", element: <DVRK.BachelorSchedulePage /> },
  { path: "/committees/dvrk/schedule/master", element: <DVRK.MasterSchedulePage /> },
  { path: "/committees/dvrk/contact", element: <DVRK.ContactPage /> },
  { path: "/committees/dvrk/form", element: <DVRK.FormPage /> },
  { path: "/committees/dvrk/bachelor", element: <DVRK.BachelorPage /> },
  { path: "/committees/dvrk/master", element: <DVRK.MasterPage /> },
]);

const App = () => {
  return (
    <>
      {getLanguageCookie() ? <RouterProvider router={router} /> : <LanguageSelector />}
    </>
  );
};

export default App;
