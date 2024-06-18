import React from "react";
import { useLoaderData } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
rehypeRaw({ allowDangerousHtml: true });
import datavetenskapLogo from "../../../assets/main.png";
import { getEndOfDayTime } from "../util";

const me = () => {
    const [slidesJSON, setSlidesJSON] = React.useState(useLoaderData());
    const [slides, setSlides] = React.useState();
    const [timeLeft, setTimeLeft] = React.useState(0);
    const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
    const [slidesElements, setSlidesElements] = React.useState();

    const filterSlidesData = (data) => {
        return data.filter(s => (s.active ?? true) && (s.start ? new Date().getTime() >= s.start : true) && (s.end ? new Date().getTime() <= getEndOfDayTime(new Date(s.end)) : true));
    };

    const fetchSlidesData = async () => {
        const s = await fetch("/getInfoScreenSlides").then(s => s.json());
        return filterSlidesData(s);
    };

    const parseSlidesJSON = (data = slidesJSON) => {
        return data.map(s => {
            switch (s.slide.type) {
                case "iframe":   return { ...s, slide: <iframe src={s.slide.src} /> }
                case "img":      return { ...s, slide: <img src={s.slide.src} /> }
                case "markdown": return { ...s, slide: <markdown><ReactMarkdown children={s.slide.content} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} /></markdown> }
            }
        });
    };

    const updateSlides = async () => {
        await fetchSlidesData().then(data => {
            if (data && data.length !== 0) {
                setSlidesJSON(data);
                setSlides(parseSlidesJSON(data));
                setTimeLeft(data[0].duration);
            } else {
                setSlidesJSON(null);
                setSlides(null);
                setTimeLeft(null);
            }
        });
    };

    const createSlidesElements = () => {
        try { // wonky solution for now. PR if you can think of something better.
            return slides.map((s, i) => {
                const nextIndex = (i+1) % slides.length;
                const currKey = slidesElements ? slidesElements[i].key : i+":0";
                const nextKey = slidesElements ? slidesElements[nextIndex].key : nextIndex+":0";
                const flippedBit = nextKey.split(":")[1] === "0" ? "1" : "0";
                return <div style={{visibility: currentSlideIndex === i ? "visible" : "hidden", position: "absolute"}} key={nextIndex === i ? nextKey + flippedBit : currKey}>{ s.slide }</div>;
            });
        } catch {
            console.log("failed to set elements. skipping...");
        }
    };

    React.useEffect(() => {
        updateSlides();
    }, []);

    React.useEffect(() => {
        if (slides) {
            setSlidesElements(createSlidesElements());

            const timer = setInterval(() => {
                setTimeLeft(tl => {
                    if (tl <= 0) {
                        clearInterval(timer);
                        const nextIndex = (currentSlideIndex + 1) % slides.length;
                        setCurrentSlideIndex(nextIndex);
                        if (nextIndex === 0) {
                            updateSlides();
                            setSlidesElements(createSlidesElements());
                        }
                        return slides[nextIndex].duration ?? slides[0].duration; // Temp fix. PR for better way to catch up.
                    } else {
                        return tl - 0.1;
                    }
                });
            }, slides.length <= 1 ? 20000 : 100);

            return () => clearInterval(timer);
        } else {
            setInterval(() => {
                updateSlides();
            }, 20000);
        }
    }, [currentSlideIndex, slides]);
    
    return <>
        { !slides && <div className="default-banner"><img src={datavetenskapLogo} /></div> }
        { slides &&
        <div id="slideshow">
            { slidesElements ?? <></> }
            <div className={`duration-progress${slidesElements ? (slidesElements.length <= 1 ? " hidden" : "") : ""}`}>
                <CircularProgressbar
                    value={slides[currentSlideIndex].duration - timeLeft}
                    maxValue={slides[currentSlideIndex].duration}
                    text={Math.ceil(timeLeft)}
                    styles={buildStyles({textSize: "2em"})}
                    key={currentSlideIndex}
                />
            </div>
        </div>
        }
    </>
};

export default me;
