const isReception = () => {
    const fromDate = new Date(Date.parse(`${new Date().getFullYear()}-07-12`));
    const toDate = new Date(Date.parse(`${new Date().getFullYear()}-09-17`));
    return (new Date().getDate() >= fromDate.getDate())
        && (new Date().getDate() <= toDate.getDate());
};

const getLanguageCookie = () => {
    let match = document.cookie.match(new RegExp('(^| )language=([^;]+)'));
    return match ? (match[2] == "null" ? null : match[2]) : null;
};
const cook = getLanguageCookie();
const english = cook ? cook == "en" : false;

const isEnglish = () => {
    return english;
};

export { isReception, isEnglish, getLanguageCookie };