import Cookies from "js-cookie";

const isAuth = async () => {
    return await fetch("/verify-token", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${Cookies.get("dv-token")}`
        },
    })
        .then(r => r.ok)
        .catch(e => false);
};

const isReception = () => {
    const fromDate = new Date(Date.parse(`${new Date().getFullYear()}-06-10`));
    const toDate = new Date(Date.parse(`${new Date().getFullYear()}-09-17`));
    const res = (new Date().getTime() >= fromDate.getTime())
        && (new Date().getTime() <= toDate.getTime());
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

const dateToLocalISO = (date = new Date()) => {
    const month = date.getMonth() + 1; // we love zero based months 😌
    const day = date.getDate();
    return `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

const getEndOfDayTime = (date = new Date()) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
};

const shuffleArray = (array) => {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

export { isReception, isEnglish, getLanguageCookie, dateToLocalISO, getEndOfDayTime, isAuth, shuffleArray };
