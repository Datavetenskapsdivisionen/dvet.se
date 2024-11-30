import React from "react";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { isEnglish } from "/src/www/util";

const me = () => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState(null);
    const [myPhotos, setMyPhotos] = React.useState(null);
    const user = decodeJwt(Cookies.get("dv-token"));

    React.useEffect(() => {
        fetch("/user/photos", { headers: { "Authorization": `Bearer ${Cookies.get("dv-token")}` } })
        .then(r => r.json())
        .then(r => setMyPhotos(r.photos ?? null));
    }, []);

    const onSubmitAction = (e) => {
        e.preventDefault();

        if (!selectedFiles) { return; }

        setIsUploading(true);

        const resField = document.getElementById("photos-response-field");
        const fields = document.getElementById("photos-post-data");
        const data = new FormData(fields);

        fetch("/photos/post", {
            method: "POST",
            headers: { "Authorization": `Bearer ${Cookies.get("dv-token")}` },
            body: data
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                resField.innerHTML = `${isEnglish() ? "Your uploaded files can be accessed from:" : "Dina uppladdade foton kan nås från:"} ${r.ok}`;
                setMyPhotos(mp => {
                    if (mp) {
                        mp.push(...r.files);
                        return mp.sort();
                    } else {
                        return [...r.files].sort();
                    }
                    
                });
            } else {
                resField.innerHTML = `Error: ${r.err}`;
            }
        })
        .catch(e => resField.innerText = `Error: ${e}`)
        .finally(() => {
            setIsUploading(false);
            setSelectedFiles(null);
        });
    };

    const onInputChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const onDelete = (hash) => {
        fetch(`/user/photos/${hash}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${Cookies.get("dv-token")}` }
        })
        .then(r => r.json())
        .then(r => r.ok && setMyPhotos(mp => mp.filter(p => !p.includes(hash))))
        .catch(e => resField.innerText = `Error: ${e}`);
    }

    return <div className="page">
        <h1>Photo host</h1>
        <form id="photos-post-data" action="/photos/post" method="post" encType="multipart/form-data">
            <label htmlFor="files" className="btn blue" style={{marginRight: "10px"}}>{isEnglish() ? "Browse photos..." : "Bläddra foton..."}</label>
            <input type="file" id="files" name="files" onChange={onInputChange} multiple accept="image/png, image/gif, image/jpeg, video/mp4" style={{display: "none"}} />
            <input onClick={onSubmitAction} type="submit" value={isUploading ? (isEnglish() ? "UPLOADING..." : "LADDAR UPP...") : (isEnglish() ? "UPLOAD" : "LADDA UPP")} disabled={isUploading || !selectedFiles} className="btn green" />
            { selectedFiles ? selectedFiles.map(f => <p>{f.name}</p>) : <p>{isEnglish() ? "No photos selected." : "Inga foton har valts."}</p> }
        </form>
        <div id="photos-response-field"></div>
        { myPhotos && myPhotos.length > 0 && <>
            <h2>{isEnglish() ? "My photos" : "Mina foton"}</h2>
            { myPhotos.map(p => {
                const name = p.substring(0, p.lastIndexOf('_'));
                const hash = p.substring(p.lastIndexOf('_'), p.lastIndexOf('.'));
                const pUrl = `/uploads/${user.email.split("@")[0]}/${p}`;
                return <div className="my-photo-item" key={hash}>
                    <img src={pUrl} width="35" height="35" />
                    <a href={pUrl} target="_blank">{name}</a>
                    <button onClick={() => onDelete(hash)} className="btn red big-text">X</button>
                </div>  
            }) }
        </>}
    </div>;
};

export default me;
