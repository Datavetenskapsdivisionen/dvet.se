const isReception = () => {
    const fromDate = new Date(Date.parse(`${new Date().getFullYear()}-07-12`));
    const toDate = new Date(Date.parse(`${new Date().getFullYear()}-09-17`));
    const res = (new Date().getTime() >= fromDate.getTime())
        && (new Date().getTime() <= toDate.getTime());
    console.log(res);
    return res;
};

const getLanguageCookie = () => {
    let match = document.cookie.match(new RegExp('(^| )language=([^;]+)'));
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lang = urlParams.get("lang");
    if (lang) {
        return lang;
    } else {
        return match ? (match[2] == "null" ? null : match[2]) : null;
    }
};
const cook = getLanguageCookie();
const english = cook ? cook == "en" : false;

const isEnglish = () => {
    return english;
};

export { isReception, isEnglish, getLanguageCookie };