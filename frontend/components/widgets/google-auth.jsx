import React from "react";
import { Outlet } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { isEnglish } from "/frontend/util";
import Cookies from "js-cookie";
import Popo from "./popo";
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

export default GoogleAuth;