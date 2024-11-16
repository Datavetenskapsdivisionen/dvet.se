import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { isEnglish, dateToPrettyTimestamp } from "/src/www/util";

let userCookie = Cookies.get("dv-github-user");
let userData = userCookie ? decodeJwt(userCookie) : null;

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

const me = (props) => {
    const liteVersion = props.liteVersion == true;
    const num = props.num ? props.num : 5;

    const data = React.useRef([]);
    const generateKey = () => new Date().getTime().toString();
    const [updateTrigger, setUpdateTrigger] = React.useState(generateKey());

    const NewsItem = (props) => {
        if (props.data === undefined) throw new Error("missing data parameter");
        const data = props.data;
    
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
                        userCookie = Cookies.get("dv-github-user");
                        userData = userCookie ? decodeJwt(userCookie) : null;
                        setUpdateTrigger(generateKey());
                        clearInterval(interval);
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
                if (response.ok) { // visual updates are a bit slow to ensure proper sync for now. PR to fix this is welcome.
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
            if (data.reactions.total_count === 0) return <></>;

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
                            key={`${data.number}-${k_emojiText}`}
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
                    {data.comments} {data.comments === 1
                        ? isEnglish() ? "comment" : "kommentar"
                        : isEnglish() ? "comments" : "kommentarer"}
                </div>
            </>;
        };
    
        const Comments = () => {
            const editIcon = <svg width="24px" height="24px" viewBox="0 -960 960 960"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>;
            const deleteIcon = <svg width="24px" height="24px" viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>;
            const defaultAvatar = <svg width="48px" height="48px" viewBox="0 0 338 338"><path d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1 1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"/></svg>
            
            return <div className="comments">
                {data.commentsData.map(c => {
                    const prettyTimestamp = dateToPrettyTimestamp(new Date(c.created_at), true);
                    const timestamp = (
                        prettyTimestamp.includes("ago") ||
                        prettyTimestamp.includes("sedan") ||
                        prettyTimestamp.includes("at") ||
                        prettyTimestamp.includes("kl"))
                            ? isEnglish() ? "commented " : "kommenterade " + prettyTimestamp
                            : isEnglish() ? "commented on " : "kommenterade den " + prettyTimestamp;
    
                    return <div key={c.id} id={`comment-${c.id}`} className="comment">
                        <img draggable="false" className="avatar" src={c.user.avatar_url} alt="avatar" />
                        <div className="comment-content">
                            <div className="comment-header">
                                <strong><a href={c.user.html_url} target="_blank">{c.user.login}</a></strong>
                                <span>{timestamp}</span>
                                { c.user.login === userData?.login &&
                                    <div className="options">
                                        <button className="edit">{editIcon}</button>
                                        <button className="delete">{deleteIcon}</button>
                                    </div>
                                }
                            </div>
                            <ReactMarkdown children={c.body} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
                        </div>
                    </div>;
                })}
                <div className={"create-comment"}>
                    { userData
                        ? <img draggable="false" className="avatar" src={userData.avatar_url} alt="avatar" />
                        : <span className="avatar default">{defaultAvatar}</span>
                    }
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

    const createElements = () => {
        const newsItems = data.current.map(e => <NewsItem key={`post-${e.id}`} data={e} />);
        return <div className="news">{newsItems}</div>;
    };

    const [page, setPage] = React.useState(1);
    const [showLoadButton, setShowLoadButton] = React.useState(true);
    const [newsElements, setNewsElements] = React.useState(<div className="loading"></div>);
    
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

    React.useEffect(() => {
        setNewsElements(createElements());
    }, [updateTrigger]);

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