import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { isEnglish } from "/src/www/util";

const fetchNews = (num, page) => (
    fetch(`/newsfeed?num=${num}&page=${page}`)
        .then(res => res.json())
        .catch(e => ({
            error: "failed to fetch news"
        })));

const stringToEmoji = (s) => {
    let ans;
    switch (s) {
        case "+1": ans = "👍"; break;
        case "-1": ans = "👎"; break;
        case "laugh": ans = "😆"; break;
        case "hooray": ans = "🎉"; break;
        case "confused": ans = "😕"; break;
        case "heart": ans = "💖"; break;
        case "rocket": ans = "🚀"; break;
        case "eyes": ans = "👀"; break;
        default: ans = "💩"; break;
    }
    return ans;
};

const createElements = (data, liteVersion) => {
    if (data.error) return <p>Could not fetch news!</p>;
    const titles = data.map(e => {
        const title = e.title;
        const avatar = e.user.avatar_url;
        const author = e.user.name;
        const time = new Date(e.created_at)
            .toLocaleString("en-GB", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        const body = e.body;
        const commentAmount = e.comments;
        const reactions =
            e.reactions
                .map(([emojiText, count]) => {
                    const emoji = stringToEmoji(emojiText);
                    return count > 0 ?
                        <div className="reaction"
                            onClick={() => window.open(e.html_url)}
                        >{emoji} {count}</div>
                        : null;
                });
        const postId = "post-" + e.id;

        return <div className="news-item" id={postId} >
            <div className="top">
                <img draggable="false" className="avatar" src={avatar} alt="avatar" />
                <h3>{title}</h3>
                <span>{time}</span>
            </div>
            <div className="content">
                <ReactMarkdown children={body} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
            </div>
            <div className="bottom">
                <div className="reactions">
                    {reactions}
                    {liteVersion ? <></> :
                        <>
                            <div className="reaction"
                                onClick={() => window.open(e.html_url)}
                            >&nbsp;+&nbsp;</div>
                            <div className="reaction"
                                onClick={() => window.open(e.html_url)} >
                                {commentAmount} kommentarer
                            </div>
                        </>
                    }
                </div>
                <span>- {author}</span>
            </div>
        </div >;
    });
    return <div className="news">{titles}</div>;
};

const me = (props) => {
    const liteVersion = props.liteVersion == true;
    const num = props.num ? props.num : 5;
    const [page, setPage] = React.useState(1);
    const [showLoadButton, setShowLoadButton] = React.useState(true);
    const [newsElements, setNewsElements] = React.useState(<div className="loading"></div>);
    const data = React.useRef([]);
    React.useEffect(() => {
        fetchNews(num, page).then((res) => {
            const newData = data.current.concat(res.posts);
            data.current = newData;
            if (page*num >= res.totalPostCount) {
                setShowLoadButton(false);
            }
            setNewsElements(createElements(newData, liteVersion));
        });
    }, [fetchNews, page]);

    const content = newsElements.error ? <h3>{newsElements.error}</h3> : newsElements;
    return <div className="news-holder">
        {liteVersion ? <></> : <h2>
            {isEnglish() ? "News" : "Nyheter"}
            <a className="rss-button" href="/newsfeed?type=rss" target="_blank">
                <img
                    src="https://wp-assets.rss.com/blog/wp-content/uploads/2019/10/10111557/social_style_3_rss-512-1.png"
                    draggable="false"
                />
            </a>
        </h2>}
        {content}
        {liteVersion || !showLoadButton ? <></> : <div className="center">
            <button onClick={() => setPage(p => p+1)}>{isEnglish() ? "See older news" : "Se äldre nyheter"}</button>
        </div>}
    </div >;
};

export default me;