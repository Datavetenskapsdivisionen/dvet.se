import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const fetchNews = () => (
    fetch("/newsfeed")
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

const createElements = (data) => {
    if (data.kind == "Error") return <p>Kunde inte hämta nyheter!</p>;
    const titles = data.posts.map(e => {
        const title = e.title;
        const avatar = e.user.avatar_url;
        const author = e.user.name;
        const time = new Date(e.created_at).toLocaleString("en-GB");
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
            <img draggable="false" className="avatar" src={avatar} alt="avatar" />
            <span>{time}</span>
            <h3>{title}</h3>
            <div className="content">
                <ReactMarkdown children={body} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
            </div>
            <span>- {author}</span>
            <div className="reactions">
                {reactions}
                <div className="reaction"
                    onClick={() => window.open(e.html_url)}
                >☺</div>
                <div className="reaction"
                    onClick={() => window.open(e.html_url)} >
                    {commentAmount} kommentarer
                </div>
            </div>
        </div >;
    });
    return <div class="news">{titles}</div>;
};

const me = (props) => {
    const [data, setData] = React.useState(<div className="loading"></div>);
    React.useEffect(() => {
        fetchNews().then((res) => setData(createElements(res)));
    }, [fetchNews]);

    const content = data.error ?
        <h3>{data.error}</h3>
        :
        data;

    return <div className="news-holder">
        <h2>
            Nyheter
            <a class="rss-button" href="/newsfeed?type=rss" target="_blank">
                <img
                    src="https://wp-assets.rss.com/blog/wp-content/uploads/2019/10/10111557/social_style_3_rss-512-1.png"
                    draggable="false"
                />
            </a>
        </h2>
        {content}
        <div className="center">
            <button onClick={
                () => window.open("https://github.com/Datavetenskapsdivisionen/posts/issues")
            }>Se äldre nyheter</button>
        </div>
    </div >;
};

export default me;