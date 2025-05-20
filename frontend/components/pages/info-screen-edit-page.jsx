import React from "react";
import { useLoaderData } from "react-router-dom";
import { isEnglish, dateToLocalISO } from "util";
import { decodeJwt } from "jose";
import Cookies from "js-cookie";
import DraggableTable from "components/widgets/draggable-table";
import DvetModal from "components/widgets/dvet-modal";
import { dateToShortDate } from "../../util";

const SlideTypes = {
    IMAGE: "img",
    IFRAME: "iframe",
    MARKDOWN: "markdown",
    VIDEO: "video"
};

const slideTypeLabels = {
    "img": isEnglish() ? "Image" : "Bild",
    "iframe": isEnglish() ? "Website" : "Hemsida",
    "markdown": "Markdown",
    "video": "Video"
};

const me = () => {
    const [jsonData, setJsonData] = React.useState(useLoaderData());
    const [selectedSlideIndex, setSelectedSlideIndex] = React.useState(null);
    const [mv, setModalValues] = React.useState(getDefaultState());
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalDropdownIsOpen, setModalDropdownIsOpen] = React.useState(false);
    const [errorText, setErrorText] = React.useState(null);

    React.useEffect(() => saveEdits(), [jsonData]);

    const saveEdits = () => {
        const token = Cookies.get("dv-token");
        fetch("/api/info-screen/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({...jsonData, slides: jsonData.slides})
        });
    };

    const onActiveClick = (index) => {
        setJsonData(oldData => {
            const newData = {...oldData};
            const newSlides = [...oldData.slides];
            newSlides[index].active = !newSlides[index].active;
            return {...newData, slides: newSlides};
        });
    };
    
    const onEditClick = (index) => {
        setSelectedSlideIndex(index);
        const user = decodeJwt(Cookies.get("dv-token"));
        const s = jsonData.slides[index];
        setModalValues({
            nameValue:      s.name,
            typeValue:      s.slide.slideType,
            durationValue:  s.duration,
            startValue:     s.start ? dateToLocalISO(new Date(s.start)) : "",
            endValue:       s.end ? dateToLocalISO(new Date(s.end)) : "",
            timeStartValue: s.timeStart ?? "",
            timeEndValue:   s.timeEnd ?? "",
            bgEffectValue:  s.bgEffect ?? "blur",
            bgValue:        s.bg ?? "#1e242a",
            activeValue:    s.active ?? true,
            valueValue:     s.slide.value ?? "",
            lastEditValue:  user.email
        });
        setModalIsOpen(true);
    };
    
    const onDeleteClick = (index) => {
        if (window.confirm("Are you sure you want to delete `" + jsonData.slides[index].name + "`?")) {
            setJsonData(oldData => {
                const newData = {...oldData};
                const newSlides = [...oldData.slides];
                newSlides.splice(index, 1);
                return {...newData, slides: newSlides};
            });
        }
    };

    const onShuffleClick = () => {
        setJsonData(oldData => {
            const newData = {...oldData};
            return {...newData, shuffle: !newData.shuffle};
        });
    };

    const onModalClose = () => {
        setSelectedSlideIndex(null);
        setModalValues(getDefaultState());
        setModalIsOpen(false);
        setModalDropdownIsOpen(false);
        setErrorText(null);
    };

    const createRow = (slide, id) => [
        slide.name,
        slideTypeLabels[slide.slide.slideType],
        `${slide.duration}s`,
        <>
            {slide.start && !slide.end
                ? <span>{isEnglish() ? "starts" : "börjar"} {dateToShortDate(new Date(slide.start))}</span>
                : <></>}
            {slide.start && slide.end
                ? <span>{dateToShortDate(new Date(slide.start))} - {dateToShortDate(new Date(slide.end))}</span>
                : <></>}
            {slide.end && !slide.start
                ? <span>{isEnglish() ? "ends" : "slutar"} {dateToShortDate(new Date(slide.end))}</span>
                : <></>}
            {(slide.start || slide.end) && (slide.timeStart || slide.timeEnd)
                ? <br />
                : <></>}
            {(slide.timeStart || slide.timeEnd)
                ? <span>{slide.timeStart} - {slide.timeEnd}</span>
                : <></>}
        </>,
        <label className="switch">
            <input type="checkbox" checked={slide.active} onChange={() => onActiveClick(id)} />
            <span className="slider green" />
        </label>,
        <a className="btn blue" onClick={() => onEditClick(id)}>{isEnglish() ? "EDIT" : "REDIGERA"}</a>,
        <a className="btn red" onClick={() => onDeleteClick(id)}>{isEnglish() ? "DELETE" : "TA BORT"}</a>,
        <a href={slide.lastEdit ? `mailto:${slide.lastEdit}?subject=[DVD info screen]: ` : ""} style={{textDecoration: "none", textAlign: "right"}}>{slide.lastEdit ? slide.lastEdit.split('@')[0] : ""}</a>
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        let errors = {};

        if (mv.nameValue.length === 0) {
            errors.name = isEnglish() ? "Name is missing" : "Namn saknas";
        }

        if (mv.valueValue.length === 0) {
            errors.value = isEnglish() ? "URL/content is missing" : "URL/innehåll saknas";
        }
        
        if (mv.timeStartValue && !mv.timeEndValue) {
            errors.end = isEnglish() ? "End time is missing" : "Sluttid saknas";
        } else if (mv.timeEndValue && !mv.timeStartValue) {
            errors.start = isEnglish() ? "Start time is missing" : "Starttid saknas";
        }

        if (Object.keys(errors).length > 0) {
            return setErrorText(errors);
        }

        const slide = {slideType: mv.typeValue, value: mv.valueValue};
        const newSlideData = {
            name: mv.nameValue,
            duration: mv.durationValue,
            active: mv.activeValue,
            start: new Date(mv.startValue).getTime(),
            end: new Date(mv.endValue).getTime(),
            timeStart: mv.timeStartValue,
            timeEnd: mv.timeEndValue,
            bgEffect: mv.bgEffectValue,
            bg: mv.bgValue,
            lastEdit: mv.lastEditValue,
            slide: slide
        };
        
        setJsonData(oldData => {
            const newData = {...oldData};
            const newSlides = [...oldData.slides];
            if (selectedSlideIndex != null) {
                newSlides[selectedSlideIndex] = newSlideData;
            } else {
                newSlides.push(newSlideData);
            }
            return {...newData, slides: newSlides};
        });

        onModalClose();
    };

    const handleMove = (from, to) => {
        setJsonData(oldData => {
            const newData = {...oldData};
            const newSlides = [...oldData.slides];
            const temp = newSlides[from];
            newSlides[from] = newSlides[to];
            newSlides[to] = temp;
            return {...newData, slides: newSlides};
        });
    };

    return <>
        <div className="page edit-info-screen">
            <h1>{isEnglish() ? "Edit info screen" : "Redigera infoskärmen"}</h1>
            <DraggableTable columns={createColumns()} rows={jsonData.slides.map(createRow)} onMove={handleMove} columnMaxWidth="250px" />
            <div>
                <a onClick={() => setModalIsOpen(true)} className="btn blue">{isEnglish() ? "ADD SLIDE" : "LÄGG TILL"}</a>
                <label className="switch">
                    <input name="shuffle" type="checkbox" checked={jsonData.shuffle} onChange={onShuffleClick} />
                    <span className="slider" />
                </label>
                <span>{isEnglish() ? "Shuffle order" : "Blanda ordning"}</span>
            </div>
        </div>

        <DvetModal className="info-screen-modal" modalIsOpen={modalIsOpen} onModalClose={onModalClose}>
            <h2>{selectedSlideIndex != null ? (isEnglish() ? "Edit slide" : "Redigera slide") : (isEnglish() ? "Add slide" : "Lägg till slide")}</h2>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="name">{isEnglish() ? "Name" : "Namn"}:</label>
                    <input name="name"
                        type="text"
                        value={mv.nameValue}
                        onChange={e => setModalValues(v => { return {...v, nameValue: e.target.value} })}
                        required
                    />

                    <label htmlFor="type">{isEnglish() ? "Type" : "Typ"}:</label>
                    <select name="type" value={mv.typeValue} onChange={e => setModalValues(v => { return {...v, typeValue: e.target.value} })} required>
                        {Object.entries(slideTypeLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>

                <div className="row full">
                    <label htmlFor="duration">Duration:</label>
                    <input name="duration"
                        type="range"
                        min="1"
                        max="30"
                        value={mv.durationValue}
                        onChange={e => setModalValues(v => { return {...v, durationValue: parseInt(e.target.value)} })}
                        required
                    />
                    <span>{mv.durationValue}s</span>
                </div>

                <div className="row full">
                    { mv.typeValue === SlideTypes.MARKDOWN ? <>
                        <span>{isEnglish() ? "Content" : "Innehåll"}:</span>
                        <textarea
                            name="value"
                            rows="6"
                            cols="30"
                            defaultValue={mv.valueValue}
                            onChange={e => setModalValues(v => { return {...v, valueValue: e.target.value} })}
                            required
                        />
                    </> : <>
                        <label htmlFor="value">URL:</label>
                        <input type="text" id="url-bar" name="value" value={mv.valueValue} onChange={e => setModalValues(v => { return {...v, valueValue: e.target.value} })} required />
                    </> }
                </div>

                { mv.typeValue === SlideTypes.IMAGE &&
                    <div className="row">
                        <span></span>
                        <a className="btn blue" href="/photos/host" target="_blank">{isEnglish() ? "UPLOAD IMAGE" : "LADDA UPP BILD"}</a>
                    </div>
                }

                <div className="dropdown">
                    <div className="dropdown-bar" onClick={() => setModalDropdownIsOpen(!modalDropdownIsOpen)}>
                        <span>{isEnglish() ? "Optional settings" : "Valfria inställningar"}</span>
                        {modalDropdownIsOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
                    </div>
                    <div className={"dropdown-content" + (modalDropdownIsOpen ? "" : " hidden")}>
                        <div className="row">
                            <label htmlFor="start">Start:</label>
                            <input name="start"
                                type="date"
                                min={dateToLocalISO(new Date())}
                                max={mv.endValue ? dateToLocalISO(new Date(mv.endValue)) : ""}
                                value={mv.startValue}
                                onChange={e => setModalValues(v => { return {...v, startValue: dateToLocalISO(new Date(e.target.value))} })} />

                            <label htmlFor="end">{isEnglish() ? "End" : "Slut"}:</label>
                            <input name="end"
                                type="date"
                                min={dateToLocalISO(mv.startValue ? new Date(mv.startValue) : new Date())}
                                value={mv.endValue}
                                onChange={e => setModalValues(v => { return {...v, endValue: mv.startValue ? (new Date(e.target.value) >= new Date(mv.startValue) ? dateToLocalISO(new Date(e.target.value)) : "") : e.target.value} })} />
                        </div>

                        <div className="row">
                            <label>{isEnglish() ? "Active time" : "Aktiv tid"}:</label>
                            <div style={{gridColumn: "span 2"}}>
                                <input name="timeStart"
                                    type="time"
                                    value={mv.timeStartValue}
                                    onChange={e => setModalValues(v => { return {...v, timeStartValue: e.target.value} })}
                                />
                                <span>-</span>
                                <input name="timeEnd"
                                    type="time"
                                    value={mv.timeEndValue}
                                    onChange={e => setModalValues(v => { return {...v, timeEndValue: e.target.value} })}
                                />
                            </div>
                        </div>

                        { mv.typeValue === SlideTypes.IMAGE &&
                            <div className="row long-title">
                                <label htmlFor="bg">{isEnglish() ? "Background" : "Bakgrund"}:</label>
                                <div style={{ gridColumn: "span 2" }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="bgEffect"
                                            value="blur"
                                            checked={!mv.bgEffectValue || mv.bgEffectValue === "blur"}
                                            onChange={() => setModalValues(v => ({ ...v, bgEffectValue: "blur" }))}
                                        />
                                        {isEnglish() ? "Blur" : "Oskärpa"}
                                    </label>
                                    <label style={{ marginLeft: "10px" }}>
                                        <input
                                            type="radio"
                                            name="bgEffect"
                                            value="colour"
                                            checked={mv.bgEffectValue === "colour"}
                                            onChange={() => setModalValues(v => ({ ...v, bgEffectValue: "colour" }))}
                                        />
                                        {isEnglish() ? "Colour" : "Färg"}
                                    </label>
                                </div>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <input name="bg"
                                        type="color"
                                        value={mv.bgValue}
                                        onChange={e => setModalValues(v => { return {...v, bgValue: e.target.value} })}
                                    />
                                    <a className="btn blue"
                                        style={{margin: "0 10px 0 0"}}
                                        onClick={() => setModalValues(v => { return {...v, bgValue: "#1e242a"} })}>
                                    RESET</a>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className="button-row">
                    <button onClick={handleSubmit} className="btn blue">
                        {selectedSlideIndex != null ? (isEnglish() ? "UPDATE SLIDE" : "UPPDATERA SLIDE") : (isEnglish() ? "ADD SLIDE" : "LÄGG TILL")}
                    </button>
                    {errorText ? <div>{Object.values(errorText).map(error => <span style={{color: "red"}}>{error}</span>)}</div> : <></>}
                </div>
            </form>
        </DvetModal>
    </>
};

const getDefaultState = () => {
    return {
        nameValue: "",
        typeValue: SlideTypes.IMAGE,
        valueValue: "",
        durationValue: 10,
        startValue: "",
        endValue: "",
        timeStartValue: "",
        timeEndValue: "",
        bgEffectValue: "blur",
        bgValue: "#1e242a",
        activeValue: true,
        lastEditValue: decodeJwt(Cookies.get("dv-token")).email
    }
};

const createColumns = () => [
    isEnglish() ? "Name" : "Namn",
    isEnglish() ? "Type" : "Typ",
    isEnglish() ? "Duration" : "Varaktighet",
    "Period",
    isEnglish() ? "Active" : "Aktiv",
    "",
    "",
    isEnglish() ? "Edited by" : "Redigerad av"
];

export default me;
