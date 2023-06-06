import React from "react";
import { useSearchParams } from "react-router-dom";



const createElements = (data, searchParams, setSearchParams) => {
    const location = searchParams.get("location");
    const path = location ? location.split("%2F").filter(r => r) : [];
    const updatePath = () => {
        let newPath = "";
        path.forEach(p => newPath += p + "%2F");
        searchParams.set("location", newPath);
        setSearchParams(searchParams);
    };
    let displayPath = "/";
    path.forEach(p => {
        data = data.children.find(c => c.id == p);
        displayPath += data.name + "/";
    });

    const backButton = path.length == 0 ? <></> :
        <div
            className="item"
            onClick={() => {
                path.pop();
                updatePath();
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="90" viewBox="-5 0 24 24" width="160"><path d="M0 0h24v24H0z" fill="none" />
                <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
            </svg>
            <span>Backa</span>
        </div>;

    const children = data.children ? data.children.map(c => {
        if (c.mimeType == "application/vnd.google-apps.folder") {
            return <div
                className="item"
                onClick={() => {
                    path.push(c.id);
                    updatePath();
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="90" viewBox="0 0 24 24" width="160">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                </svg>
                <span>{c.name}</span>
            </div>;
        } else {
            return <div
                className="item"
                onClick={() => window.open(c.url)}
            >
                <div className="preview-holder">
                    <div className="overlay"></div>
                    <iframe className="preview" src={c.previewUrl} allow="autoplay"
                        width="160px"
                        height="90px" />
                </div>
                <span>{c.name}</span>
            </div>;
        }
    }) : [];
    const page = <>
        <div className="photo-holder">{backButton}{children}</div>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
    </>
        ;
    return [page, displayPath];
};


const fetchImageData = () => (
    fetch("getPhotos")
        .then(res => res.json())
        .catch(e => ({
            error: "failed to fetch images"
        })));

const me = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [[data, folderName], setData] = React.useState([<div className="loading"></div>, "Loading"]);
    React.useEffect(() => {
        fetchImageData().then((res) => setData(createElements(res, searchParams, setSearchParams)));
    }, [fetchImageData, searchParams]);

    return <div className="page">
        <h1>Bilder - {folderName}</h1>
        {data}
    </div>;
};

export default me;
