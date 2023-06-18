import React from "react";
import Modal from "react-modal";


const isToday = (date) => {
    const today = new Date();
    return date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();
};

const hasPassed = (date) => (date < new Date());

const EVENT_LIMIT = 5;
const getEventData = async (full, eventUrl, restUrl, openModal, setModalData) => {
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
    const hidingEvents = data.length > EVENT_LIMIT;
    if (full !== true) {
        data = data.slice(0, EVENT_LIMIT);
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
        }

        const location = o.location
            ? o.location.split(",").slice(0, 2).join(", ")
            : <>&nbsp;</>;

        if (o.description) className += " clickable";
        const action = (o.description) ? () => {
            setModalData([o.summary, o.description, dateElem, o.committee, location]);
            openModal();
        } : () => { };

        return <div className={className} onClick={action}>
            <h3>{o.summary}</h3>
            <h4>{dateElem}</h4>
            <h4>{location}</h4>
            <p>Arrangör: {o.committee}</p>
        </div>;
    });
    if (full !== true && hidingEvents) {
        data.push(
            <div
                className="schedule-item upcoming-button"
                onClick={() => window.open(restUrl, "_self")}
            >
                <h3>Uppkommande</h3>
                <p> Tryck här för att se resten av eventen!</p>
            </div>
        );
    }
    return <div className="kickoff-schedule">
        {data}
        {/* <pre style={{ textAlign: "left" }}>{JSON.stringify(json, null, 4)}</pre> */}
    </div>;
};

let oldVisible = false;

const me = (props) => {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const afterOpenModal = () => { };
    const closeModal = () => setIsOpen(false);

    const [[modalTitle, modalContent, modalWhen, modalWho, modalWhere], setModalData] = React.useState(["event", "about", "2020", "whom", "where"]);

    const [csv, setState] = React.useState(<div className="loading"></div>);
    React.useEffect(() => {
        getEventData(
            props.full, props.eventUrl,
            props.restUrl, openModal, setModalData
        ).then((res) => setState(res));
    }, [getEventData]);

    const month = new Date().getMonth() + 1;

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
            <p>När: {modalWhen}</p>
            <p>Vart: {modalWhere}</p>
            <p>Vilka hostar: {modalWho}</p>
            <button onClick={closeModal} className="close-button">X</button>
        </Modal>
    </div>;
};

export default me;