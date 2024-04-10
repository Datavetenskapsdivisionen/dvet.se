import React, { useEffect } from "react";
import { isEnglish } from "../../util";

const me = (props) => {
    const [iframeLoaded, setIframeLoaded] = React.useState(false);
    const onIframeLoad = () => { setIframeLoaded(true); };
    const resetIframeLoad = () => { setIframeLoaded(false); };
    
    const closeOnEsc = React.useCallback((e) => {
        if (e.key === "Escape") {
            resetIframeLoad();
            props.onClose();
        }
    });

    React.useEffect(() => {
        document.addEventListener("keydown", closeOnEsc, false);
        return () => { document.removeEventListener("keydown", closeOnEsc, false); }
    }, [closeOnEsc]);

    return props.curr ?
        <div className="background-dim" onClick={() => { resetIframeLoad(); props.onClose(); }}>
            <div className="photo-viewer">
                <div>
                    <span onClick={props.prev ? (e) => { e.stopPropagation(); resetIframeLoad(); props.onPrev(); } : undefined}>
                        <svg width="75px" height="75px" viewBox="0 0 1024.00 1024.00" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="15">
                            <g><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill={ props.prev ? "#ffffff" : "#646464"}></path></g>
                        </svg>
                    </span>

                    { !iframeLoaded && <img src={props.curr.thumbnailUrl} className={!iframeLoaded ? "loaded" : "hidden"} referrerPolicy="no-referrer" /> }
                    <iframe src={props.curr.previewUrl} key={props.curr} className={iframeLoaded ? "loaded" : "hidden"} onLoad={onIframeLoad} referrerPolicy="no-referrer" />

                    <span onClick={props.next ? (e) => { e.stopPropagation(); resetIframeLoad(); props.onNext(); } : undefined}>
                        <svg width="75px" height="75px" viewBox="0 0 1024.00 1024.00" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="15" transform="matrix(-1, 0, 0, -1, 0, 0)">
                            <g><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill={ props.next ? "#ffffff" : "#646464" }></path></g>
                        </svg>
                    </span>
                </div>
                <div>
                    { props.photoNums.curr } { isEnglish() ? "of" : "av" } { props.photoNums.total }
                </div>
            </div>
        </div>
    : <></> ;
}

export default me;
