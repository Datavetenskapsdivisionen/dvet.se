import React from "react";
import Cookies from "js-cookie";

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

export default LanguageSelector;