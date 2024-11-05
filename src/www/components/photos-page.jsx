import React from "react";
import { useSearchParams } from "react-router-dom";
import { isEnglish } from "../util";
import PhotoView from "../components/widgets/photo-view";

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="99" viewBox="-5 0 24 24" width="160">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
    </svg>
);

const DirectoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="99" viewBox="0 0 24 24" width="160">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
);

const VideoPlayIcon = () => (
    <svg viewBox="0 0 200 200" width="60px" height="60px" alt="Play video">
        <circle cx="100" cy="100" r="90" fill="none" strokeWidth="12" stroke="#fff" strokeOpacity="0.8" />
        <circle cx="100" cy="100" r="97" fill="none" stroke="black" strokeWidth="1px" />
        <circle cx="100" cy="100" r="83" fill="none" stroke="black" strokeWidth="1px" />
        <polygon points="70, 55 70, 145 145, 100" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="8" />
        <polygon points="65, 46 65, 154 155, 100" fill="none" stroke="black" strokeWidth="1px" />
        <polygon points="75, 64 75, 136 135, 100" fill="none" stroke="black" strokeWidth="1px" />
    </svg>
);

const createElements = (data, searchParams, setSearchParams, setSelectedIndex) => {
    if (data.error) return [<></>, data.error];
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
            <BackIcon />
            <span>{isEnglish() ? "Go back" : "Backa"}</span>
        </div>;

    const children = data.children ? data.children.map((c, i) => {
        if (c.mimeType == "application/vnd.google-apps.folder") {
            if (c.childrenCount > 0) {
                return <div
                    className="item"
                    onClick={() => {
                        path.push(c.id);
                        updatePath();
                    }}>
                    <span className="dir-count">{c.childrenCount}</span>
                    <DirectoryIcon />
                    <span className="title-bar">{c.name}</span>
                </div>;
            }
        } else {
            return <div
                className="item preview-holder"
                // onClick={() => window.open(c.url)}
                onClick={() => setSelectedIndex(i)}
            >
                { c.mimeType.includes("video") ? 
                    <div className="overlay">
                        <VideoPlayIcon />
                    </div>
                : <></> }
                <img className="preview" src={c.thumbnailUrl} referrerPolicy="no-referrer" />
                {/* <span className="title-bar">{c.name}</span> */}
            </div>;
        }
    }) : [];
    const page = <>
        <div className="photo-holder">{backButton}{children}</div>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
    </>
        ;
    return [page, displayPath, data];
};


const fetchImageData = () => (
    fetch("/getPhotos")
        .then(res => res.json())
        .catch(e => ({ error: isEnglish() ? "failed to fetch images" : "kunde inte hämta bilder" }))
);

const me = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [[pageData, folderName, data], setPageData] = React.useState([<div className="loading"></div>, "Loading"]);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    React.useEffect(() => {
        fetchImageData().then(res => { setPageData(createElements(res, searchParams, setSearchParams, setSelectedIndex)) });
    }, [fetchImageData, searchParams]);

    const photoView = (
        <PhotoView
            hasPrev={selectedIndex >= 1 && selectedIndex < data.children.length}    
            currentPhoto={selectedIndex >= 0 && selectedIndex < data.children.length ? data.children[selectedIndex] : ""}
            hasNext={selectedIndex >= 0 && selectedIndex < data.children.length-1}
            onClose={() => setSelectedIndex(-1)}
            onPrev={() => setSelectedIndex(selectedIndex - 1)}
            onNext={() => setSelectedIndex(selectedIndex + 1)}
            photoNums={{ curr: selectedIndex + 1, total: data ? data.children.length : 0 }}
        />
    );
    
    return <>
        { photoView }
        <div className="page">
            <h1>{isEnglish() ? "Photos" : "Bilder"} - {folderName}</h1>
            {pageData}
            {isEnglish() ? <div>
                <br />
                If you find any photos you wish to be removed here please contact <a href="mailto:styrelsen@dvet.se">styrelsen@dvet.se </a>
                and we will remove them!
            </div> : <div>
                <br />
                Om du hittar några bilder som du önskar ska bli borttagna så kan du kontakta <a href="mailto:styrelsen@dvet.se">styrelsen@dvet.se </a>
                så tar vi bort dom!
            </div>}
        </div>
    </>
};

export default me;
