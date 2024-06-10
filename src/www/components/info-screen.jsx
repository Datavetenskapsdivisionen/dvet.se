import React from "react";
import { useLoaderData } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
rehypeRaw({ allowDangerousHtml: true });
import datavetenskapLogo from "../../../assets/main.png";

const me = () => {
    const slidesJSON = useLoaderData().filter(s => s.active ?? true); // TODO: filter start & end dates
    const [slides, setSlides] = React.useState(null);
    const [timeLeft, setTimeLeft] = React.useState(0);
    const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
    const [allSlides, setAllSlides] = React.useState();

    React.useEffect(() => {
        if (slidesJSON && slidesJSON.length !== 0) {
            setSlides(() => {
                return slidesJSON.map(s => {
                    switch (s.slide.type) {
                        case "iframe":   return { ...s, slide: <iframe src={s.slide.src} /> }
                        case "img":      return { ...s, slide: <img src={s.slide.src} /> }
                        case "markdown": return { ...s, slide: <markdown><ReactMarkdown children={s.slide.content} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} /></markdown> }
                    }
                });
            });
            setTimeLeft(slidesJSON[0].duration);
        }
    }, []);

    React.useEffect(() => {
        if (slides) {
            setAllSlides(oldSlides => {
                return slides.map((s, i) => {
                    const nextIndex = (currentSlideIndex + 1) % slides.length;
                    const currKey = oldSlides ? oldSlides[i].key : i+":0";
                    const nextKey = oldSlides ? oldSlides[nextIndex].key : nextIndex+":0";
                    const flippedBit = nextKey.split(":")[1] === "0" ? "1" : "0";
                    return <div style={{visibility: currentSlideIndex === i ? "visible" : "hidden", position: "absolute"}} key={nextIndex === i ? nextKey + flippedBit : currKey}>{ s.slide }</div>;
                })
            });

            const timer = setInterval(() => {
                setTimeLeft(tl => {
                    if (tl <= 0) {
                        clearInterval(timer);
                        const newIndex = (currentSlideIndex + 1) % slides.length;
                        setCurrentSlideIndex(newIndex);
                        return slides[newIndex].duration;
                    } else {
                        return tl - 0.1;
                    }
                });
            }, 100);

            return () => clearInterval(timer);
        }
    }, [currentSlideIndex, slides]);
    
    return <>
        { !slides && <div className="default-banner"><img src={datavetenskapLogo} /></div> }
        { slides &&
        <div id="slideshow">
            { allSlides ?? <></> }
            <div className="duration-progress">
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
