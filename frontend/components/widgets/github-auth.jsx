import React from "react";
import Cookies from "js-cookie";

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

export default GithubAuth;