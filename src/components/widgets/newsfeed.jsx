import React from "react";

const fetchNews = () => (
    fetch("http://localhost:8080/newsfeed")
        .then(res => res.json())
        .catch(e => ({
            error: "failed to fetch news"
        })));

const stringToEmoji = (s) => {
    let ans;
    switch (s) {
        case "THUMBS_UP": ans = "👍"; break;
        case "THUMBS_DOWN": ans = "👎"; break;
        case "LAUGH": ans = "😆"; break;
        case "HOORAY": ans = "🎉"; break;
        case "CONFUSED": ans = "😕"; break;
        case "HEART": ans = "💖"; break;
        case "ROCKET": ans = "🚀"; break;
        case "EYES": ans = "👀"; break;
        default: ans = "💩"; break;
    }
    return ans;
};

const createElements = (data) => {
    const titles = data.edges.map(e => {
        const title = e.post.title;
        const description = e.post.frontmatter.description;
        const avatar = e.post.author.avatarUrl;
        const author = e.post.author.name;
        const time = new Date(e.post.createdAt).toLocaleString("en-GB");
        const reactions = Object.entries(e.post.reactions)
            .map(([emojiText, count]) => {
                const emoji = stringToEmoji(emojiText);
                return count > 0 ?
                    <div className="reaction">{emoji} {count}</div>
                    : null;
            });
        return <div className="news-item" onClick={() => console.log("clicky")}>
            <img draggable="false" src={avatar} alt="avatar" />
            <span>{time}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <span>- {author}</span>
            <div className="reactions">
                {reactions}
                <div className="reaction"
                    onClick={() => window.open(e.post.url)}
                >☺</div>
            </div>
        </div >;
    });
    return <div>{titles}</div>;
};

const me = (props) => {
    const [data, setData] = React.useState("");
    React.useEffect(() => {
        fetchNews().then((res) => setData(createElements(res)));
    }, [fetchNews]);

    const content = data.error ?
        <h3>{data.error}</h3>
        :
        data;

    return <div className="news-holder">
        <h2>Nyheter</h2>
        <div>{content}</div>
        <button onClick={
            () => window.open("https://github.com/Datavetenskapsdivisionen/posts/issues")
        }>Se mer</button>
    </div >;
};

export default me;