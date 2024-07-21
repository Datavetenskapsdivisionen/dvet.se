import React from "react";
import Modal from "react-modal";
import { isEnglish } from "../../util";
import { useNavigate } from 'react-router-dom';

const isToday = (date) => {
    const today = new Date();
    return date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();
};

const isNew = (date, numOfDays) => {
    const today = new Date();
    const nDaysAgo = new Date(today.setDate(today.getDate() - numOfDays));;
    return new Date(date) >= nDaysAgo;
};

const hasPassed = (date) => (date < new Date());

const getEventData = async (full, eventUrl, restUrl, eventLimit, openModal, setModalData, navigate) => {
    const json = await (await fetch(eventUrl)).json();
    let data = json
        .map(o => {
            o.dateData.start = new Date(Date.parse(o.dateData.start));
            o.dateData.end = new Date(Date.parse(o.dateData.end));
            return o;
        })
        .filter(o => {
            if (full === true) return true;
            if (isToday(o.dateData.start)) {
                return true;
            } else if (hasPassed(o.dateData.start)) {
                return false;
            } else {
                return true;
            }
        });
    const hidingEvents = data.length > eventLimit;
    if (full !== true) {
        data = data.slice(0, eventLimit);
    }
    data = data.map(o => {
        const dateElem = o.dateData.isDay
            ? <>
                <span>{o.dateData.start.toLocaleDateString("se-SE")}</span>
                {/* <br /> */}
                <span>&nbsp;</span>
            </>
            : <>
                <span>{o.dateData.start.toLocaleDateString("se-SE")}</span>
                &nbsp;|
                <span>
                    {`
                        ${o.dateData.start.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })} - 
                        ${o.dateData.end.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })}
                    `}
                </span>
            </>;
        let className = "schedule-item";
        if (isToday(o.dateData.start)) {
            className += " active";
        } else if (hasPassed(o.dateData.start)) {
            className += " passed";
        } else {
            className += " upcoming";
            if (isNew(o.dateData.created, 3)) {
                className += " new";
            }
        }

        const location = o.location
            ? o.location.split(",").slice(0, 2).join(", ")
            : <>&nbsp;</>;

        let newTag = null;
        if (isNew(o.dateData.created, 3)) newTag = <div className="new-tag">
            N<br />
            E<br />
            W
        </div>;
        let infoTag = null;
        if (o.description) className += " clickable";
        if (o.description) infoTag = <div className="info-tag">
            I<br />
            N<br />
            F<br />
            O
        </div>;
        const action = (o.description) ? () => {
            setModalData([o.summary, o.description, dateElem, o.committee, location]);
            openModal();
        } : () => { };

        return <div className={className} onClick={action}>
            <div className="post-title">
                <h3 dangerouslySetInnerHTML={{ __html: o.summary }} ></h3>
                {(newTag || infoTag) &&
                    <div className="tags">
                        {newTag}
                        {infoTag}
                    </div>
                }
            </div>
            <h4>{dateElem}</h4>
            <h4>{location}</h4>
            <p>Host: {o.committee}</p>
        </div>;
    });
    if (full !== true && hidingEvents) {
        data.push(
            <div
                className="schedule-item upcoming-button"
                onClick={() => navigate(restUrl)}
            >
                <h3>{isEnglish() ? "Upcoming" : "Uppkommande"}</h3>
                <p>{isEnglish() ? "Click here to see the rest of the events!" : "Tryck här för att se resten av eventen!"}</p>
            </div>
        );
    }
    if (data.length == 0) {
        return <h1>{isEnglish() ? "No upcoming events" : "Inga uppkommande event"}</h1>;
    } else {
        return <div className="kickoff-schedule">
            {data}
            {/* <pre style={{ textAlign: "left" }}>{JSON.stringify(json, null, 4)}</pre> */}
        </div>;
    };
};

const Schedule = (props) => {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const afterOpenModal = () => { };
    const closeModal = () => setIsOpen(false);
    const navigate = useNavigate();

    const [[modalTitle, modalContent, modalWhen, modalWho, modalWhere], setModalData] = React.useState(["event", "about", "2020", "whom", "where"]);

    const [csv, setState] = React.useState(<div className="loading"></div>);
    React.useEffect(() => {
        getEventData(
            props.full, props.eventUrl ?? "/getEvents",
            props.restUrl ?? "/schedule",
            props.eventLimit ?? 5,
            openModal, setModalData,
            navigate
        ).then((res) => setState(res))
            .catch(() => setState(<div>{isEnglish() ? "Unable to fetch events " : "Det gick inte att hämta events"}</div>));
    }, [getEventData]);

    return <div className="schedule-holder">
        {csv}
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            appElement={document.getElementById("app")}
            className="schedule-modal"
            overlayClassName="schedule-modal-overlay"
        >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{modalTitle}</h2>
            <p>{modalContent}</p>
            <p>When: {modalWhen}</p>
            <p>Where: {modalWhere}</p>
            <p>Who is hosting: {modalWho}</p>
            <button onClick={closeModal} className="close-button">X</button>
        </Modal>
    </div>;
};


const monthName = i => isEnglish()
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][i]
    : ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"][i];
const dayName = i => isEnglish()
    ? ["Monday", "Tuesday", "Wendesday", "Thursday", "Friday", "Saturday", "Sunday"][i]
    : ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"][i];
const numberSuffix = i => {
    if (isEnglish()) switch (i % 10) {
        case 1: return `${i}st`;
        case 2: return `${i}nd`;
        case 3: return `${i}rd`;
        default: return `${i}th`;

    }
    else return [1, 2].includes(i % 10) ? `${i}:a` : `${i}:e`;
};
const getCalenderData = async (full, eventUrl, _restUrl, _eventLimit, openModal, setModalData, _navigate) => {
    const json = await (await fetch(eventUrl)).json();
    let data = json
        .map(o => {
            o.dateData.start = new Date(Date.parse(o.dateData.start));
            o.dateData.end = new Date(Date.parse(o.dateData.end));
            return o;
        });

    let years = {};
    for (const event of data) {
        const year = event.dateData.start.getFullYear();
        if (!years[year]) years[year] = {};

        const month = event.dateData.start.getMonth();
        if (!years[year][month]) years[year][month] = {};

        const day = event.dateData.start.getDate();
        if (!years[year][month][day]) years[year][month][day] = [];

        years[year][month][day].push(event);
    }
    for (const y in years) {
        for (const m in years[y]) {
            const numDays = new Date(y, m, 0).getDate();
            for (let i = 1; i < numDays; i++) {
                if (!years[y][m][i]) years[y][m][i] = [];
            }
            let daysBefore = new Date(y, m, 1).getDay() - 1;
            if (daysBefore < 0) daysBefore += 7;
            for (let i = 1; i <= daysBefore; i++) {
                years[y][m][-i] = { beforeDay: true, length: 0 };
            }
        }
    }

    // splicer
    if (!full) {
        for (const y in years) {
            for (const m in years[y]) {
                let keys = Object.keys(years[y][m]).map(Number).sort((a, b) => a - b);

                let max = 0;
                let splice = [];
                for (const d of keys) {
                    if (years[y][m][d].length == 0) {
                        max += 1;
                        splice.push(d);
                    }
                    else break;
                }
                let closest = Math.floor(max / 7) * 7;
                for (let i = 0; i < closest; i++) {
                    delete years[y][m][keys[i]];
                }
            }
        }

        // clear behind 
        for (const y in years) {
            for (const m in years[y]) {
                let keys = Object.keys(years[y][m]).map(Number).sort((a, b) => a - b);
                keys.reverse();

                for (const d of keys) {
                    if (years[y][m][d].length == 0) {
                        delete years[y][m][d];
                    } else break;
                }
            }
        }
    }

    const currentDay = new Date();
    // const currentDay = new Date(2024, 7, 21);

    let children = [];
    for (const y in years) {
        let calender = [];
        for (const m in years[y]) {
            let content = [];

            for (const d of Object.keys(years[y][m]).map(Number).sort((a, b) => a - b)) {
                const cl = (currentDay.getFullYear() == y && currentDay.getMonth() == m && currentDay.getDate() == d)
                    ? " current"
                    : currentDay.getTime() - new Date(y, m, d) > 0 ? " passed" : "";

                if (years[y][m][d].beforeDay) {
                    content.push(<div className={"calender-slot previous-calender-slot"}>
                        <div className="event-container"></div>
                        <div className="event-date-container">...</div>
                    </div >);
                } else {
                    let events = years[y][m][d].map(e => {
                        const dateElem = e.dateData.isDay
                            ? <>
                                <span>{e.dateData.start.toLocaleDateString("se-SE")}</span>
                                {/* <br /> */}
                                <span>&nbsp;</span>
                            </>
                            : <>
                                <span>{e.dateData.start.toLocaleDateString("se-SE")}</span>
                                &nbsp;|
                                <span>
                                    {`
                                    ${e.dateData.start.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })} - 
                                    ${e.dateData.end.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })}
                                `}
                                </span>
                            </>;
                        const location = e.location
                            ? e.location.split(",").slice(0, 2).join(", ")
                            : <>&nbsp;</>;
                        const action = () => {
                            console.log(e);
                            setModalData([
                                e.summary,
                                e.description,
                                dateElem, e.committee, location
                            ]);
                            openModal();
                        };
                        let time = e.dateData.isDay ? <></> :
                            <>
                                <br />
                                <span>
                                    {e.dateData.start.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })} - {e.dateData.end.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </>;
                        return <button onClick={action}>{e.summary.replace("/", " / ")}{time}</button>;
                    });
                    content.push(<div className={(years[y][m][d].length > 0 ? "calender-slot" : "calender-slot empty-calender-slot") + cl}>
                        <div className="event-container">{events}</div>
                        <div className="event-date-container">{numberSuffix(d)} <span>{dayName((new Date(y, m, d).getDay() + 6) % 7)}</span></div>
                    </div >);
                }
            }
            let temp = [];
            for (let i = 0; i < 7; i++) {
                temp.push(<div className="day-name">{dayName(i)}</div >);
            };
            temp.push(content);
            content = temp;

            calender.push(<div className="calender">
                <h4 className="calender-title">{`${monthName(m)} ${y}`}</h4>
                <div className="calender-slot-container">{content}</div>
            </div>);
        }
        children.push(calender);
    }

    if (data.length == 0) {
        return <h1>{isEnglish() ? "No upcoming events" : "Inga uppkommande event"}</h1>;
    } else {
        return <div className="kickoff-calender-container">
            {children}
            {/* <pre style={{
                // position: "absolute", left: 0, right: 0, 
                textAlign: "left",
                backgroundColor: "rgba(0.9,0.9,0.9,0.2)"

            }}>{JSON.stringify(years, undefined, 4)}</pre> */}
        </div>;
    };
};

const CalenderSchedule = (props) => {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const afterOpenModal = () => { };
    const closeModal = () => setIsOpen(false);
    const navigate = useNavigate();

    const [[modalTitle, modalContent, modalWhen, modalWho, modalWhere], setModalData] = React.useState(["event", "about", "2020", "whom", "where"]);

    const [csv, setState] = React.useState(<div className="loading"></div>);
    React.useEffect(() => {
        getCalenderData(
            props.full, props.eventUrl ?? "/getEvents",
            props.restUrl ?? "/schedule",
            props.eventLimit ?? 5,
            openModal, setModalData,
            navigate
        ).then((res) => setState(res))
            .catch(() => setState(<div>{isEnglish() ? "Unable to fetch events " : "Det gick inte att hämta events"}</div>));
    }, [getEventData]);

    return <div className="schedule-holder">
        {csv}
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            appElement={document.getElementById("app")}
            className="schedule-modal"
            overlayClassName="schedule-modal-overlay"
        >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{modalTitle}</h2>
            <p>{modalContent}</p>
            <p>When: {modalWhen}</p>
            <p>Where: {modalWhere}</p>
            <p>Who is hosting: {modalWho}</p>
            <button onClick={closeModal} className="close-button">X</button>
        </Modal>
    </div>;
};

export { Schedule, CalenderSchedule };