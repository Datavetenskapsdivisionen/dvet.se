import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import textSe from "/content/home-page/home-page.md";
import textEn from "/content/home-page/home-page-en.md";
import KickoffInfoButton from "/src/www/components/widgets/kickoff-info-button";
import NewsFeed from "/src/www/components/widgets/newsfeed";
import { Schedule } from "/src/www/components/widgets/schedule";
import { isEnglish, isReception } from "/src/www/util";

const text = isEnglish() ? textEn : textSe;

const me = () => (
    <div className="page">
        <KickoffInfoButton />
        <ReactMarkdown children={text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        {!isReception()
            ?
            <>
                <h2>
                    Events
                    <button className="calender-button" onClick={() => {
                        window.open("https://calendar.google.com/calendar/embed?src=c_cd70b7365c189248ae5fce47932c65729fb3a0a4052a83b610613f1e6dcfd047%40group.calendar.google.com&ctz=Europe%2FStockholm", "_blank");
                    }}>
                        <span>📅</span>
                    </button>
                </h2>
                <Schedule eventLimit={2} />
            </>
            : <></>}

        <NewsFeed />
    </div>
);

export default me;