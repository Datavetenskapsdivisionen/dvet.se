import React from "react";

import Cookies from "js-cookie";

const test = (e) => {
    e.preventDefault();

    const resField = document.getElementById("photos-response-field");
    const fields = document.getElementById("photos-post-data");
    const data = new FormData(fields);

    fetch("/photos/post", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${Cookies.get("dv-token")}`
        },
        body: data
    })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                resField.innerHTML = r.ok;
            } else {
                resField.innerHTML = `Error: ${r.err}`;
            }
        })
        .catch(e => resField.innerText = `Error: ${e}`);
};

const me = () => {
    return <>
        <div id="photos-response-field"></div>
        <form id="photos-post-data" action="/photos/post" method="post" enctype="multipart/form-data">
            <label for="folder">Folder:</label>
            <input type="text" id="folder" name="folder" />
            <br /><br />
            <label for="files">Select files:</label>
            <input type="file" id="files" name="files" multiple accept="image/png, image/gif, image/jpeg, video/mp4" />
            <br /><br />
            <input onClick={test} type="submit" />
        </form>
    </>;
};

export default me;