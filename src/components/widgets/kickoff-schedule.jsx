import React from "react";
import csvFile from "../../../Content/kickoff-schedule.csv";
import csv from "csvtojson";
import Modal from "react-modal";


const isToday = (date) => {
    const today = new Date();
    return date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();
};

const hasPassed = (date) => (date < new Date());

const getCsvObject = async (openModal, setModalData) => {
    const res = await csv().fromString(csvFile);
    const data = res.map(o => {
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
            <p>{o["Aktivitet"]}</p>
            <h4>{o["Datum"]}</h4>
            {/*  */}
        </div>;
    });
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
        getCsvObject(openModal, setModalData).then((res) => setState(res));
    }, [getCsvObject]);

    return <div className="schedule-holder">
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
    </div>;
};

export default me;