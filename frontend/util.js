import Cookies from "js-cookie";

const isAuth = async () => {
    const dv_token = Cookies.get("dv-token");
    if (!dv_token) {
        return false;
    }

    return await fetch("/api/verify-token", { method: "POST", headers: { "Authorization": `Bearer ${Cookies.get("dv-token")}` }})
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("lang") ?? Cookies.get("language");
};

const isEnglish = () => {
    const cook = getLanguageCookie();
    return cook ? cook === "en" : false;
};

const dateToLocalISO = (date = new Date(), withTime = false) => {
    const month = date.getMonth() + 1; // we love zero based months 😌
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const pad = (num) => num.toString().padStart(2, '0');
    if (withTime) {
        return `${date.getFullYear()}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}`;
    } else {
        return `${date.getFullYear()}-${pad(month)}-${pad(day)}`;
    }
};

const dateToShortDate = (date = new Date()) => {
    const yearOption = date.getFullYear() === (new Date()).getFullYear() ? undefined : "numeric";
    return date.toLocaleDateString(isEnglish() ? "en-GB" : "sv-SE", { year: yearOption, month: "short", day: "numeric" });
};

const dateToPrettyTimestamp = (date = new Date()) => {
    const now = new Date();
    const diff = now - date;
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    const isYesterday = (now.getDate() - date.getDate() === 1) && (now.getMonth() === date.getMonth()) && (now.getFullYear() === date.getFullYear());
    const pad = (num) => num.toString().padStart(2, '0');
    if (isYesterday) {
        return `${isEnglish() ? "yesterday at" : "igår kl"} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else if (diffInHours >= 24) {
        const yearOption = date.getFullYear() === now.getFullYear() ? undefined : "numeric";
        const d = date.toLocaleDateString(isEnglish() ? "en-GB" : "sv-SE", { year: yearOption, month: "short", day: "numeric" });
        const t = date.toLocaleTimeString(isEnglish() ? "en-GB" : "sv-SE", { hour: "2-digit", minute: "2-digit" });
        return `${d} ${t}`;
    } else if (diffInHours >= 1) {
        return `${isEnglish() ? "today at" : "idag kl"} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else if (diffInMinutes >= 1) {
        return `${diffInMinutes} ${isEnglish()
            ? (diffInMinutes === 1 ? "minute ago" : "minutes ago")
            : (diffInMinutes === 1 ? "minut sedan" : "minuter sedan")}`;
    } else {
        return `${diffInSeconds} ${isEnglish()
            ? (diffInSeconds === 1 ? "second ago" : "seconds ago")
            : (diffInSeconds === 1 ? "sekund sedan" : "sekunder sedan")}`;
    }
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

export { isReception, isEnglish, getLanguageCookie, dateToLocalISO, dateToShortDate, dateToPrettyTimestamp, getEndOfDayTime, isAuth, shuffleArray };
