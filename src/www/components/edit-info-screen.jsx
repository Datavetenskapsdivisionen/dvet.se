import React from "react";
import Modal from "react-modal";
import { useLoaderData } from "react-router-dom";
import { isEnglish } from "../util";
import { draggable, dropTargetForElements, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
// import { attachClosestEdge, Edge, extractClosestEdge, } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import invariant from "tiny-invariant";
import Cookies from "js-cookie";
import { dateToLocalISO } from "../util";
import { decodeJwt } from "jose";

const me = () => {
    const jsonData = useLoaderData();
    const slidesJSON = jsonData.slides;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [selectedSlideIndex, setSelectedSlideIndex] = React.useState(null);
    const defaultState = {nameValue: "", typeValue: "iframe", valueValue: "", durationValue: 10, startValue: "", endValue: "", activeValue: true, lastEditValue: decodeJwt(Cookies.get("dv-token")).email};
    const [values, setValues] = React.useState(defaultState);
    const [onOffStates, setOnOffStates] = React.useState([]);
    const [isShuffleOn, setIsShuffleOn] = React.useState(jsonData.shuffle ?? false);

    const updateOnOffStates = () => {
        setOnOffStates(slidesJSON.map(s => s.active ?? true));
    };
    React.useEffect(() => {updateOnOffStates()}, [slidesJSON]);

    const saveEdits = () => {
        const token = Cookies.get("dv-token");
        fetch("/info-screen/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({...jsonData, slides: slidesJSON})
        });
    };

    const onActiveClick = (index) => {
        const currVal = slidesJSON[index].active ?? true;
        slidesJSON[index].active = !currVal;
        updateOnOffStates();
        saveEdits();
    };

    const onEditClick = (index) => {
        setSelectedSlideIndex(index);
        const user = decodeJwt(Cookies.get("dv-token"));
        const s = slidesJSON[index];
        setValues({
            nameValue:     s.name,
            typeValue:     s.slide.slideType,
            durationValue: s.duration,
            startValue:    s.start ? dateToLocalISO(new Date(s.start)) : "",
            endValue:      s.end ? dateToLocalISO(new Date(s.end)) : "",
            activeValue:   s.active ?? true,
            valueValue:    s.slide.value ?? "",
            lastEditValue: user.email
        });
        setIsOpen(true);
    };

    const onDeleteClick = (index) => {
        if (window.confirm("Are you sure you want to delete `" + slidesJSON[index].name + "`?")) {
            slidesJSON.splice(index, 1);
            updateOnOffStates();
            saveEdits();
        }
    };

    const onShuffleClick = () => {
        const shuffle = jsonData.shuffle;
        jsonData.shuffle = !shuffle;
        setIsShuffleOn(!shuffle);
        saveEdits();
    }

    const onModalClose = () => {
        setValues(defaultState);
        setSelectedSlideIndex(null);
        setIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const slide = {slideType: values.typeValue, value: values.valueValue};
        const newSlideData = {name: values.nameValue, duration: values.durationValue, active: values.activeValue, start: new Date(values.startValue).getTime(), end: new Date(values.endValue).getTime(), lastEdit: values.lastEditValue, slide: slide};
        
        if (selectedSlideIndex != null) {
            slidesJSON[selectedSlideIndex] = newSlideData;
        } else {
            slidesJSON.push(newSlideData);
        }

        updateOnOffStates();
        saveEdits();
        onModalClose();
    };

    const SlideRow = (props) => {
        const s = props.slide;
        const i = props.id;

        const [dragged, setDragged] = React.useState(false);
        const [isDraggedOver, setIsDraggedOver] = React.useState(false);
        
        const rowRef  = React.useRef(null);
        const dragRef = React.useRef(null);

        React.useEffect(() => {
            const row = rowRef.current;
            const drag = dragRef.current;
            invariant(row);
            draggable({
                element: row,
                dragHandle: drag,
                getInitialData: () => ({ index: i }),
                onDragStart: () => setDragged(true),
                onDrop: () => setDragged(false)
            });
            dropTargetForElements({
                element: row,
                getData: () => ({ index: i }),
                onDragEnter: () => setIsDraggedOver(true),
                onDragLeave: () => setIsDraggedOver(false),
                onDrop: () => setIsDraggedOver(false)
            });
        }, [slidesJSON]);

        return (
            <tr className={(dragged ? "dragged " : "") + (isDraggedOver ? "dragged-over" : "")} key={i} ref={rowRef}>
                <td ref={dragRef}>
                    <svg width="32" height="32" viewBox="0 0 24 24" role="presentation">
                        <g fill="currentColor" fillRule="evenodd">
                            <circle cx="10" cy="8"  r="1" />
                            <circle cx="14" cy="8"  r="1" />
                            <circle cx="10" cy="16" r="1" />
                            <circle cx="14" cy="16" r="1" />
                            <circle cx="10" cy="12" r="1" />
                            <circle cx="14" cy="12" r="1" /> 
                        </g>
                    </svg>
                </td>
                <td>{s.name}</td>
                <td>{s.slide.slideType}</td>
                <td>{s.duration}s</td>
                <td>{s.start ? dateToLocalISO(new Date(s.start)) : ""}</td>
                <td>{s.end ? dateToLocalISO(new Date(s.end)) : ""}</td>
                <td><a className={"btn " + (onOffStates[i] ? "green" : "red")} onClick={() => onActiveClick(i)}>{onOffStates[i] ? (isEnglish() ? "ON" : "PÅ") : (isEnglish() ? "OFF" : "AV")}</a></td>
                <td><a className="btn blue" onClick={() => onEditClick(i)}>{isEnglish() ? "EDIT" : "REDIGERA"}</a></td>
                <td><a className="btn red" onClick={() => onDeleteClick(i)}>{isEnglish() ? "DELETE" : "TA BORT"}</a></td>
                <td style={{textAlign: "right"}}><a href={s.lastEdit ? `mailto:${s.lastEdit}?subject=[DVD info screen]: ` : ""} style={{textDecoration: "none"}}>{s.lastEdit ? s.lastEdit.split('@')[0] : ""}</a></td>
            </tr>
        );
    };

    const moveRow = (from, to) => {
        slidesJSON.splice(to, 0, slidesJSON.splice(from, 1)[0]);
        updateOnOffStates();
        saveEdits();
    };

    const Slides = () => {
        const slideRows = slidesJSON.map((s, i) => <SlideRow slide={s} id={i} />);

        React.useEffect(() => {
            return monitorForElements({
                onDrop({ source, location }) {
                    const destination = location.current.dropTargets[0];
                    if (!destination) { return; }

                    const sourceIndex = source.data.index;
                    const destinationIndex = destination.data.index;
                    moveRow(sourceIndex, destinationIndex);
                }
            });
        }, [slideRows]);

        return (
            <table className="edit-slides">
                <thead>
                    <tr>
                        <th></th>
                        <th>{isEnglish() ? "Name" : "Namn"}</th>
                        <th>{isEnglish() ? "Type" : "Typ"}</th>
                        <th>{isEnglish() ? "Duration" : "Varaktighet"}</th>
                        <th>Start</th>
                        <th>{isEnglish() ? "End" : "Slut"}</th>
                        <th>{isEnglish() ? "Active" : "Aktiv"}</th>
                        <th></th>
                        <th></th>
                        <th>{isEnglish() ? "Edited by" : "Redigerad av"}</th>
                    </tr>
                </thead>
                <tbody>
                { slideRows }
                </tbody>
            </table>
        );
    };
    
    return <>
        <div className="page">
            <h1>{isEnglish() ? "Edit info screen" : "Redigera infoskärmen"}</h1>
            <div className="edit-slides-container">
                <Slides />
                <div>
                    <a onClick={() => setIsOpen(true)} className="btn blue">{isEnglish() ? "ADD SLIDE" : "LÄGG TILL"}</a>
                    
                    <label className="switch">
                        <input name="shuffle" type="checkbox" checked={isShuffleOn} onChange={onShuffleClick} />
                        <span className="slider" />
                    </label>
                    <span>{isEnglish() ? "Shuffle order" : "Blanda ordning"}</span>
                </div>
            </div>
        </div>
        
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={onModalClose}
            appElement={document.getElementById("app")}
            className="schedule-modal"
            overlayClassName="schedule-modal-overlay"
        >
            <button onClick={onModalClose} className="close-button">X</button>
            <h2>{selectedSlideIndex != null ? (isEnglish() ? "Edit slide" : "Redigera slide") : (isEnglish() ? "Add slide" : "Lägg till slide")}</h2>

            <form onSubmit={handleSubmit}>
                <label for="name">{isEnglish() ? "Name" : "Namn"}:</label>
                <input name="name"
                    type="text"
                    value={values.nameValue}
                    onChange={e => setValues(v => { return {...v, nameValue: e.target.value} })}
                    required
                />

                <label for="type">{isEnglish() ? "Type" : "Typ"}:</label>
                <select name="type" value={values.typeValue} onChange={e => setValues(v => { return {...v, typeValue: e.target.value} })} required>
                    <option value="iframe">{isEnglish() ? "Website" : "Hemsida"}</option>
                    <option value="img">{isEnglish() ? "Image" : "Bild"}</option>
                    <option value="markdown">Markdown</option>
                </select>
                <br />

                <label for="duration">{isEnglish() ? "Duration" : "Varaktighet"}:</label>
                <input name="duration"
                    type="range"
                    min="1"
                    max="30"
                    value={values.durationValue}
                    onChange={e => setValues(v => { return {...v, durationValue: parseInt(e.target.value)} })}
                    required
                />
                <span>{values.durationValue}s</span>
                <br />

                <label for="start">Start:</label>
                <input name="start"
                    type="date"
                    min={dateToLocalISO(new Date())}
                    max={values.endValue ? dateToLocalISO(new Date(values.endValue)) : ""}
                    value={values.startValue}
                    onChange={e => setValues(v => { return {...v, startValue: dateToLocalISO(new Date(e.target.value))} })} />
                <span>({isEnglish() ? "optional" : "valfri"})</span>
                <br />

                <label for="end">{isEnglish() ? "End" : "Slut"}:</label>
                <input name="end"
                    type="date"
                    min={dateToLocalISO(values.startValue ? new Date(values.startValue) : new Date())}
                    value={values.endValue}
                    onChange={e => setValues(v => { return {...v, endValue: values.startValue ? (new Date(e.target.value) >= new Date(values.startValue) ? dateToLocalISO(new Date(e.target.value)) : "") : e.target.value} })}
                />
                <span>({isEnglish() ? "optional" : "valfri"})</span>
                <br />

                { values.typeValue === "markdown" ? <>
                    <p>{isEnglish() ? "Content" : "Innehåll"}:</p>
                    <textarea name="value" rows="6" cols="30" onChange={e => setValues(v => { return {...v, valueValue: e.target.value} })} required>
                        {values.valueValue}
                    </textarea>
                </> : <>
                    <label for="value">URL:</label>
                    <input type="text" name="value" value={values.valueValue} onChange={e => setValues(v => { return {...v, valueValue: e.target.value} })} required />
                </> }
                <br />

                <button onClick={handleSubmit} className="btn blue">
                    {selectedSlideIndex != null ? (isEnglish() ? "UPDATE SLIDE" : "UPPDATERA SLIDE") : (isEnglish() ? "ADD SLIDE" : "LÄGG TILL")}
                </button>
            </form>
        </Modal>
    </>
};

export default me;
