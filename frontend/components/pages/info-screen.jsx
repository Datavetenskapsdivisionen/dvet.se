import React, { StrictMode } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
rehypeRaw({ allowDangerousHtml: true });
import datavetenskapLogo from "/frontend/assets/datavetenskap-logo-gold.png";
import { getEndOfDayTime, shuffleArray } from "util";
import { useLoaderData } from "react-router-dom";
import { useOnlineStatus } from "hooks/useOnlineStatus";
import InstagramLogo from "/frontend/assets/instagram.png";
import DiscordLogo from "/frontend/assets/discord-mark-blue.svg";

const DEFAULT_DURATION = 20;
let isOnline;

class InfoScreen {
    constructor(loaderData) {
        this.slides = this.filterSlidesData(loaderData.slides);
        this.allSlides = structuredClone(this.slides);
        this.shuffle = loaderData.shuffle;
    }

    filterSlidesData = (slides) => {
        return slides.filter(s => {
            const isWithinTime = (timeStart, timeEnd) => {
                if (!timeStart || !timeEnd) { return true; }
                const now = new Date();
                const [startHour, startMinute] = timeStart.split(':').map(Number);
                const [endHour, endMinute] = timeEnd.split(':').map(Number);
                return now >= new Date().setHours(startHour, startMinute, 0, 0)
                    && now <= new Date().setHours(endHour, endMinute, 0, 0);
            }
            return (s.active ?? true) && 
                (s.start ? new Date().getTime() >= s.start : true) && 
                (s.end   ? new Date().getTime() <= getEndOfDayTime(new Date(s.end)) : true) &&
                isWithinTime(s.timeStart, s.timeEnd);
        }).reverse();
    }

    next = async () => {
        if (!this.slides || this.slides.length === 0) {
            if (isOnline) {
                try {
                    const response = await fetch("/api/info-screen");
                    if (response.ok) {
                        const data = await response.json();
                        this.shuffle = data.shuffle;
                        if (this.shuffle) {
                            this.slides = shuffleArray(this.filterSlidesData(data.slides));
                        } else {
                            this.slides = this.filterSlidesData(data.slides);
                        }
                        this.allSlides = structuredClone(this.slides);
                    } else {
                        this.slides = this.allSlides;
                    }
                } catch {
                    this.slides = this.allSlides;
                }
            } else {
                this.slides = this.allSlides;
            }
        }

        return this.slides.pop() ?? null;
    }
}

function createInfoScreen(infoScreen) {
    if (!infoScreen instanceof InfoScreen) {
        throw Error("Expected infoScreen to be an instance of InfoScreen. Received: " + infoScreen);
    }

    let initCallback;
    let slideCallback;

    return {
        async start() {
            if (!slideCallback) {
                throw Error("A `slide` callback has not been set. Do so before starting the info screen.");
            }

            let duration = DEFAULT_DURATION;

            const loop = async () => {
                const slide = await infoScreen.next();
                slideCallback(slide);
                setTimeout(loop, duration * 1000);
                duration = slide && infoScreen.allSlides.length > 1 ? slide.duration : DEFAULT_DURATION;
            };

            if (initCallback) {
                const s1 = await infoScreen.next();
                const s2 = await infoScreen.next();
                duration = s2 ? s2.duration : DEFAULT_DURATION;
                initCallback([s1, s2]);
                setTimeout(loop, (s1 ? s1.duration : DEFAULT_DURATION) * 1000);
            } else {
                loop();
            }
        },

        on(event, callback) {
            if (event === "init") {
                initCallback = callback;
            } else if (event === "slide") {
                slideCallback = callback;
            } else {
                throw Error("Unsupported event: " + event);
            }
        },

        parseSlideData(s) {
            if (!s) { return null; }
    
            switch (s.slide.slideType) {
                case "iframe":   return <iframe src={s.slide.value} />;
                case "img":      return <img src={s.slide.value} style={{backgroundColor: s.bg}} />;
                case "markdown": return <markdown><ReactMarkdown children={s.slide.value} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} /></markdown>;
            }
        }
    }
}

const me = () => {
    const [infoScreenData, _] = React.useState(new InfoScreen(useLoaderData()));
    const [weatherComponent, setWeatherComponent] = React.useState(null);
    const slideElems = React.useRef([[null, null], [null, null]]);
    const [percentage, setPercentage] = React.useState(null);
    const stepRef = React.useRef(0);
    const flipRef = React.useRef(0);
    isOnline = useOnlineStatus();

    const currentSlide = slideElems.current[flipRef.current];

    const createWeatherComponent = () => {
        fetch("/api/weather").then(r => r.json()).then(r => {
            setWeatherComponent(<>
                <img className="big" src={r.current.weatherIcon} />
                {r.current.temperature.toFixed(1)}°C
            </>);
        });
    };

    const startWeatherTimer = () => {
        createWeatherComponent();
        setInterval(() => {
            createWeatherComponent();
        }, 1000*60*16); // 16 min (accomodates for the 30 minute hard refresh)
    };

    const startInfoScreenTimer = (updateFrequency) => {
        setInterval(() => {
            setPercentage(currPercent => (currPercent + stepRef.current) <= 100 ? currPercent + stepRef.current : 100);
        }, updateFrequency);
    };
    
    React.useEffect(() => {
        const updateFrequency = 40;
        const infoScreen = createInfoScreen(infoScreenData);
        
        infoScreen.on("init", (slides) => {
            for (i in slides) {
                slideElems.current[i][0] = infoScreen.parseSlideData(slides[i]);
                slideElems.current[i][1] = slides[i];
            }

            setPercentage(0);
            stepRef.current = currentSlide[1] ? (100 / slideElems.current[flipRef.current][1].duration) * (updateFrequency / 1000) : 0;
        });

        infoScreen.on("slide", (slide) => {
            if (slide) {
                const nextFlip = () => (flipRef.current + 1) % slideElems.current.length;
                flipRef.current = nextFlip();
                setTimeout(() => {
                    slideElems.current[nextFlip()][0] = infoScreen.parseSlideData(slide);
                    slideElems.current[nextFlip()][1] = slide;
                }, 300); // Wait for 300ms to prevent a flashing effect
                
                setPercentage(0);
                if (slideElems.current[flipRef.current][1]) {
                    stepRef.current = (100 / slideElems.current[flipRef.current][1].duration) * (updateFrequency / 1000);
                } else {
                    stepRef.current = (100 / DEFAULT_DURATION) * (updateFrequency / 1000);
                }
            } else {
                flipRef.current = 0;
                slideElems.current = [[null, null], [null, null]];
                setPercentage(0);
                stepRef.current = 0;
            }
        });
        
        infoScreen.start();
        startWeatherTimer();
        startInfoScreenTimer(updateFrequency);

        setTimeout(() => {
            if (isOnline) {
                fetch("/ping").then(r => {
                    if (!r.ok) { return; }
                    window.location.href = window.location.href.split('?')[0] + '?refresh=' + new Date().getTime();
                });
            }
        }, 1000*60*30); // refresh page every 30 minutes
    }, []);

    return <>
        <div className="info-screen">
            <div className="top-bar">
                <div><span><img src={InstagramLogo} alt="Instagram" />@datavetenskapsdivisionen</span></div>
                <div><span><img src={DiscordLogo} alt="Discord" />dvet.se/discord</span></div>
                <div className="big">
                    <span>{weatherComponent}</span>
                    <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
            { (!isOnline || !currentSlide[0]) && <div className="default-banner"><img src={datavetenskapLogo} /></div> }
            { currentSlide && currentSlide[1] &&
                <div id="slideshow">
                    { slideElems.current.map((slide,i) => <div style={{
                        opacity: i === flipRef.current ? 1 : 0,
                        transition: infoScreenData.allSlides.length > 1 ? "opacity 0.25s" : "",
                        willChange: "opacity",
                        position:   "absolute"
                    }}>{ slide[0] }</div>) }
                    { isOnline && infoScreenData.allSlides.length > 1 &&
                        <div className="duration-progress">
                            <CircularProgressbar
                                value={percentage}
                                text={<tspan dy={2}>{Math.ceil(currentSlide[1].duration * (1 - percentage / 100))}</tspan>}
                                styles={buildStyles({ pathTransition: "none", strokeLinecap: "butt" })}
                            />
                        </div>
                    }
                </div>
            }
        </div>
    </>
};

export default me;
