import React, { useEffect, useState } from "react";

const me = () => {
    const [value, setValue] = useState("");
    const [links, setLinks] = useState([]);
    useEffect(async () => {
        let l = await (await fetch("/link-api",)).json();
        setLinks(l);
    }, []);

    return <div className="page">
        <h1>Add Link</h1>
        <input id="url-link" type="url" placeholder="url" />
        <button onClick={async () => {
            let input = document.getElementById("url-link");
            let val = input.value;
            if (!val) return;
            input.value = "";

            let uri = (await fetch("/link-post", {
                method: "post",
                body: JSON.stringify({ val: val }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(r => r.json())).response;
            setValue(uri);
        }}>Add URL</button>
        <p>Got url: <a href={value}>{value}</a></p>
        <pre>
            {JSON.stringify(links, undefined, 4)}
        </pre>
    </div>;
};
export default me;