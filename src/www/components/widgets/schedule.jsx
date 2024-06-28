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
}

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
        if (isNew(o.dateData.created, 3)) newTag = <div className="info">
            N<br />
            E<br />
            W
        </div>;
        let infoTag = null;
        if (o.description) className += " clickable";
        if (o.description) infoTag = <div className="info">
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

let oldVisible = false;

const me = (props) => {
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

export default me;