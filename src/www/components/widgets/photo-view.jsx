import React, { useEffect } from "react";
import { isEnglish } from "/src/www/util";

/**
 * Renders a photo viewer with previous and next buttons and a photo counter.
 * 
 * @param {boolean} props.hasPrev - Indicates if there is a previous photo.
 * @param {Object} props.currentPhoto - The current photo object.
 * @param {boolean} props.hasNext - Indicates if there is a next photo.
 * @param {function} props.onClose - Function to call when closing the photo viewer.
 * @param {function} props.onPrev - Function to call when navigating to the previous photo.
 * @param {function} props.onNext - Function to call when navigating to the next photo.
 * @param {Object} props.photoNums - Object containing the current and total number of photos.
 * @param {number} props.photoNums.curr - The current photo number.
 * @param {number} props.photoNums.total - The total number of photos.
 */
const me = (props) => {
    const [iframeLoaded, setIframeLoaded] = React.useState(false);
    const onIframeLoad = () => { setIframeLoaded(true); };
    const resetIframeLoad = () => { setIframeLoaded(false); };

    const hasPrev = props.hasPrev;
    const currentPhoto = props.currentPhoto;
    const hasNext = props.hasNext;
    const onClose = props.onClose;
    const onPrev = props.onPrev;
    const onNext = props.onNext;
    const photoNums = props.photoNums;
    
    const closeOnEsc = React.useCallback((e) => {
        if (e.key === "Escape") {
            resetIframeLoad();
            onClose();
        }
    });

    React.useEffect(() => {
        document.addEventListener("keydown", closeOnEsc, false);
        return () => { document.removeEventListener("keydown", closeOnEsc, false); }
    }, [closeOnEsc]);

    const PreviousButton = (props) => (
        <span onClick={hasPrev ? (e) => { e.stopPropagation(); resetIframeLoad(); onPrev(); } : undefined}>
            <svg width={props.width} height={props.height} viewBox="0 0 1024.00 1024.00" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="15">
                <g><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill={ hasPrev ? "#ffffff" : "#646464"}></path></g>
            </svg>
        </span>
    );

    const NextButton = (props) => (
        <span onClick={hasNext ? (e) => { e.stopPropagation(); resetIframeLoad(); onNext(); } : undefined}>
            <svg width={props.width} height={props.height} viewBox="0 0 1024.00 1024.00" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="15" transform="matrix(-1, 0, 0, -1, 0, 0)">
                <g><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill={ hasNext ? "#ffffff" : "#646464" }></path></g>
            </svg>
        </span>
    );

    const ThumbnailImg = () => (
        <img src={currentPhoto.thumbnailUrl} className={!iframeLoaded ? "loaded" : "hidden"} referrerPolicy="no-referrer" />
    );

    const IframeImg = (props) => (
        <iframe src={currentPhoto.previewUrl} key={currentPhoto} className={props.hidden ? "hidden" : "loaded"} onLoad={onIframeLoad} referrerPolicy="no-referrer" />
    );

    const PhotoCounter = () => (
        <label>{ photoNums.curr } { isEnglish() ? "of" : "av" } { photoNums.total }</label>
    );

    return currentPhoto ?
        <div className="background-dim" onClick={() => { resetIframeLoad(); onClose(); }}>
            <div id="desktop" className="photo-viewer">
                <div>
                    <PreviousButton width="75px" height="75px" />

                    { !iframeLoaded && <ThumbnailImg /> }
                    <IframeImg hidden={!iframeLoaded} />

                    <NextButton width="75px" height="75px" />
                </div>
                <PhotoCounter />
            </div>

            <div id="mobile" className="photo-viewer">
                <div>
                    { !iframeLoaded && <ThumbnailImg /> }
                    <IframeImg hidden={!iframeLoaded} />

                    <div className="nav-buttons">
                        <PreviousButton width="50px" height="50px" />
                        <PhotoCounter />
                        <NextButton width="50px" height="50px" />
                    </div>
                </div>
            </div>
        </div>
    : <></> ;
}

export default me;
