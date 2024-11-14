import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { isEnglish, dateToLocalISO } from "/src/www/util";

const userCookie = Cookies.get("dv-github-user");

const fetchNews = (num, page) => (
    fetch(`/newsfeed?num=${num}&page=${page}`)
        .then(res => res.json())
        .catch(e => ({
            error: "failed to fetch news"
        })));

const reactionEmojis = {
    "+1": "👍",
    "-1": "👎",
    "laugh": "😆",
    "hooray": "🎉",
    "confused": "😕",
    "heart": "❤️",
    "rocket": "🚀",
    "eyes": "👀"
};

const stringToEmoji = (s) => {
    return reactionEmojis[s] || "💩";
};

const NewsItem = (props) => {
    if (props.data === undefined) throw new Error("missing data parameter");
    const data = props.data;
    const liteVersion = props.liteVersion ?? false;

    const userData = userCookie ? decodeJwt(userCookie) : null;

    const body = data.body;
    const postId = "post-" + data.id;
    const time = new Date(data.created_at).toLocaleString("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const [showEmojiPanel, setShowEmojiPanel] = React.useState(false);
    const [showComments, setShowComments] = React.useState(false);
    const [reactionsElement, setReactionsElement] = React.useState(<></>);
    const [timerRunning, setTimerRunning] = React.useState(false);

    React.useEffect(() => {
        setReactionsElement(createReactions());

        const handleClickOutside = (event) => {
            if (!event.target.closest(`#${postId} .emoji-panel`)) {
                setShowEmojiPanel(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
        if (timerRunning) {
            // Wait for user to finish signing in
            const interval = setInterval(() => {
                console.log("waiting...");
                if (!userCookie && Cookies.get("dv-github-user")) {
                    window.location.reload();
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timerRunning]);

    const hasReacted = (reaction) => {
        return data.reactionData.find(r => r.user.login === userData?.login && r.content === reaction);
    };

    const authenticateWithGithub = async () => {
        await fetch('/github-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(data => {
            if (!data.authenticated) {
                setTimerRunning(true);
                window.open('/github-auth', 'popup', 'width=768,height=750');
            }
        });
    };

    const onReactionButtonClick = () => {
        setShowEmojiPanel(!showEmojiPanel);
        authenticateWithGithub();
    };

    const onReact = (postId, reaction) => {
        if (!userData) {
            authenticateWithGithub();
            return;
        }

        const reacted = hasReacted(reaction);
        const url = reacted ? `/newsfeed/${postId}/react/${reacted.id}` : `/newsfeed/${postId}/react`;
        const method = reacted ? "DELETE" : "POST";
        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reaction: reaction })
        }).then(res => res.json()).then(response => {
            console.log(response);
            if (response.ok) { // visual updates are a bit slow for now. PR to fix this is welcome.
                const updatedPost = response.post;
                data.reactionData = updatedPost.reactionData;
                data.reactions = updatedPost.reactions;
                setReactionsElement(createReactions());
            }
        });

        setShowEmojiPanel(false);
    };
    
    const onCommentsClick = () => {
        setShowComments(!showComments);
    };

    const createReactions = () => {
        const getNames = (emojiText) => {
            const names = data.reactionData.filter(r => r.content === emojiText).map(r => r.user.full_name);
            const numOfNames = 3;
            if (names.length > numOfNames) {
                const andMore = isEnglish() ? (" and " + (names.length - numOfNames) + " more") : (" och " + (names.length - 3) + " till");
                return names.slice(0, numOfNames).join(", ") + andMore;
            } else {
                return names.join(", ");
            }
        };

        const r = Object.entries(data.reactions).filter(([e, _]) => e != "url" && e != "total_count");
        return <>
            { r.map(([k_emojiText, v_count]) => {
                const emoji = stringToEmoji(k_emojiText);
                return v_count > 0
                    ? <div
                        key={k_emojiText}
                        className={"reaction" + (hasReacted(k_emojiText) ? " active" : "")}
                        title={getNames(k_emojiText)}
                        onClick={() => onReact(data.number, k_emojiText)}
                    >{emoji} {v_count}</div>
                    : null;
            }) }
        </>
    };

    const EmojiPanel = () => {
        return <div className="emoji-panel">
            {Object.keys(reactionEmojis).map(e => <div
                className={"emoji" + (hasReacted(e) ? " active" : "")}
                onClick={() => { onReact(data.number, e) }}
                key={e}>
                    {stringToEmoji(e)}
                </div>
            )}
        </div>;
    };

    const NewsButtons = () => {
        return <>
            <div className="news-btn" onClick={onReactionButtonClick}>&nbsp;+&nbsp;</div>
            <div className="news-btn" onClick={onCommentsClick}>
                {data.comments} {isEnglish() ? "comments" : "kommentarer"}
            </div>
        </>;
    };

    const Comments = () => {
        return <div className="comments">
            {data.commentsData.map(c => <div key={c.id} id={`comment-${c.id}`} className="comment">
                <img draggable="false" className="avatar" src={c.user.avatar_url} alt="avatar" />
                <div className="comment-content">
                    <div>
                        <strong><a href={c.user.html_url} target="_blank">{c.user.login}</a></strong>
                        <span>
                            {isEnglish() ? "commented on " : "kommenterade den "}
                            {dateToLocalISO(new Date(c.created_at))}
                        </span>
                    </div>
                    <ReactMarkdown children={c.body} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
                </div>
            </div>)}
            <div className={"create-comment"}>
                <img draggable="false" className="avatar" src={userData.avatar_url} alt="avatar" />
                <textarea placeholder={isEnglish() ? "Write a comment..." : "Skriv en kommentar..."}></textarea>
                <button className="btn blue">{isEnglish() ? "Comment" : "Kommentera"}</button>
            </div>
        </div>;
    };

    return <div className="news-item" id={postId} >
        <div className="top">
            <img draggable="false" className="avatar" src={data.user.avatar_url} alt="avatar" />
            <h3>{data.title}</h3>
            <span>{time}</span>
        </div>
        <div className="content">
            <ReactMarkdown children={body} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        </div>
        <div className="bottom">
            <div className="reactions">
                {reactionsElement}
                {!liteVersion && <>
                    {showEmojiPanel && <EmojiPanel />}
                    <NewsButtons />
                </>}
            </div>
            <span>- {data.user.full_name}</span>
        </div>
        {showComments && <Comments />}
    </div >;
};

const createElements = (data, liteVersion) => {
    const titles = data.map(e => <NewsItem key={e.id} data={e} liteVersion={liteVersion} />);
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
            const newData = data.current.concat(res.posts); // Loads older news
            data.current = newData;
            if (page*num >= res.totalPostCount) {
                setShowLoadButton(false);
            }
            setNewsElements(createElements(newData, liteVersion));
        });
    }, [page]);

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
        {newsElements}
        {liteVersion || !showLoadButton ? <></> : <div className="center">
            <button onClick={() => setPage(p => p+1)}>{isEnglish() ? "See older news" : "Se äldre nyheter"}</button>
        </div>}
    </div >;
};

export default me;