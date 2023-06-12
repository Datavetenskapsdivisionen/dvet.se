import React from "react";
import csvFile from "../../../../content/kickoff-schedule.csv";
import csv from "csvtojson";
import Modal from "react-modal";


const isToday = (date) => {
    const today = new Date();
    return date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();
};

const hasPassed = (date) => (date < new Date());

const EVENT_LIMIT = 4;
const getCsvObject = async (full, openModal, setModalData) => {
    const res = await csv().fromString(csvFile);
    let filterCount = 0;
    let data = res
        .filter(o => {
            if (full === true) return true;
            const date = new Date(Date.parse(o["Datum"]));
            if (isToday(date)) {
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
            const date = new Date(Date.parse(o["Datum"]));
            let className = "schedule-item";
            if (isToday(date)) {
                className += " active";
            } else if (hasPassed(date)) {
                className += " passed hidden";
            } else {
                className += " upcoming";
            }

            if (o["beskrivning"]) className += " clickable";
            const action = (o["beskrivning"]) ? () => {
                setModalData([o["Aktivitet"], o["beskrivning"], o["Datum"], o["Arrangör"]]);
                openModal();
            } : () => { };

            return <div className={className} onClick={action}>
                <h3>{o["Arrangör"]}</h3>
                <h4>{o["Datum"]}</h4>
                <p>{o["Aktivitet"]}</p>
                {/*  */}
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
    return <div className="kickoff-schedule">{data}</div>;
};

let oldVisible = false;

const me = (props) => {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const afterOpenModal = () => { };
    const closeModal = () => setIsOpen(false);

    const [[modalTitle, modalContent, modalWhen, modalWho], setModalData] = React.useState(["event", "about", "2020", "whom"]);

    const [csv, setState] = React.useState(0);
    React.useEffect(() => {
        getCsvObject(props.full, openModal, setModalData).then((res) => setState(res));
    }, [getCsvObject]);

    const backButton = (props.full == true) ?
        <button onClick={() => {
            const events = Array.from(document.getElementsByClassName("passed"));
            if (!oldVisible) {
                events.forEach(x => x.classList.remove("hidden"));
                oldVisible = true;
            }
            else {
                events.forEach(x => x.classList.add("hidden"));
                oldVisible = false;
            }
        }}>Toggla tidigare event</button>
        : <></>;

    const month = new Date().getMonth() + 1;

    return month >= 6 && month < 9 ? <div className="schedule-holder">
        {backButton}
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
            <p>Vilka hostar: {modalWho}</p>
            <button onClick={closeModal} className="close-button">X</button>
        </Modal>
    </div> : null;
};

export default me;