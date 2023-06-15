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
const getCsvObject = async (full, openModal, setModalData) => {
    const json = await (await fetch("/getKickOffEvents")).json();
    let filterCount = 0;
    let data = json
        .filter(o => {
            if (full === true) return true;
            const date = new Date(Date.parse(o["Datum"]));
            if (isToday(date)) {
                filterCount += 1;
                return true;
            } else if (hasPassed(date)) {
                return false;
            } else {
                filterCount += 1;
                if (filterCount < EVENT_LIMIT)
                    return true;
                else return false;
            }
        })
        .map(o => {
            const dateData = {
                start: new Date(Date.parse(o.start.date ? o.start.date : o.start.dateTime)),
                end: new Date(Date.parse(o.end.date ? o.end.date : o.end.dateTime)),
                isDay: o.start.dateTime == null && o.end.dateTime == null
            };
            const dateElem = dateData.isDay
                ? <>
                    <span>{dateData.start.toLocaleDateString("se-SE")}</span>
                    {/* <br /> */}
                    <span>&nbsp;</span>
                </>
                : <>
                    <span>{dateData.start.toLocaleDateString("se-SE")}</span>
                    &nbsp;|
                    <span>
                        {`
                            ${dateData.start.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })} - 
                            ${dateData.end.toLocaleTimeString("se-SE", { hour: "2-digit", minute: "2-digit" })}
                        `}
                    </span>
                </>;
            const date = dateData.end;
            let className = "schedule-item";
            if (isToday(date)) {
                className += " active";
            } else if (hasPassed(date)) {
                className += " passed hidden";
            } else {
                className += " upcoming";
            }

            const lastParanthases = /\((\w+|[0,9]|\+|å|ä|ö| |&|\.|!|\t)+\)$/;
            const committee = o.summary.match(lastParanthases)
                ? o.summary.match(lastParanthases)[0].slice(1, -1)
                : "DVD";
            const summary = o.summary.replace(lastParanthases, "");

            const location = o.location
                ? o.location.split(",").slice(0, 2).join(", ")
                : <>&nbsp;</>;

            if (o.description) className += " clickable";
            const action = (o.description) ? () => {
                setModalData([summary, o.description, dateElem, committee, location]);
                openModal();
            } : () => { };

            return <div className={className} onClick={action}>
                <h3>{summary}</h3>
                <h4>{dateElem}</h4>
                <h4>{location}</h4>
                <p>Arrangörer: {committee}</p>
            </div>;
        });
    if (!full && filterCount >= EVENT_LIMIT) {
        data.push(
            <div
                className="schedule-item upcoming-button"
                onClick={() => window.open("/committees/dvrk/schedule", "_self")}
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

    const [csv, setState] = React.useState(<div class="loading"></div>);
    React.useEffect(() => {
        getCsvObject(props.full, openModal, setModalData).then((res) => setState(res));
    }, [getCsvObject]);

    // const backButton = (props.full == true) ?
    //     <button onClick={() => {
    //         const events = Array.from(document.getElementsByClassName("passed"));
    //         if (!oldVisible) {
    //             events.forEach(x => x.classList.remove("hidden"));
    //             oldVisible = true;
    //         }
    //         else {
    //             events.forEach(x => x.classList.add("hidden"));
    //             oldVisible = false;
    //         }
    //     }}>Toggla tidigare event</button>
    //     : <></>;

    const month = new Date().getMonth() + 1;

    return (month >= 6 && month <= 9) || props.full == true ? <div className="schedule-holder">
        {/* {backButton} */}
        {csv}
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            //style={customStyles}
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
    </div> : <></>;
};

export default me;