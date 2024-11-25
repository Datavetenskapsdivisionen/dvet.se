import React from "react";
import { useLoaderData } from "react-router-dom";
import { isEnglish, dateToLocalISO } from "/src/www/util";
import { decodeJwt } from "jose";
import Cookies from "js-cookie";
import DraggableTable from "/src/www/components/widgets/draggable-table";
import DvetModal from "/src/www/components/widgets/dvet-modal";

const me = () => {
    const [jsonData, setJsonData] = React.useState(useLoaderData());
    const [selectedSlideIndex, setSelectedSlideIndex] = React.useState(null);
    const [mv, setModalValues] = React.useState(getDefaultState());
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    React.useEffect(() => saveEdits(), [jsonData]);

    const saveEdits = () => {
        const token = Cookies.get("dv-token");
        fetch("/info-screen/update", {
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
            nameValue:     s.name,
            typeValue:     s.slide.slideType,
            durationValue: s.duration,
            startValue:    s.start ? dateToLocalISO(new Date(s.start)) : "",
            endValue:      s.end ? dateToLocalISO(new Date(s.end)) : "",
            bgValue:       s.bg ?? "#1e242a",
            activeValue:   s.active ?? true,
            valueValue:    s.slide.value ?? "",
            lastEditValue: user.email
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
    };

    const createRow = (slide, id) => [
        slide.name,
        slide.slide.slideType,
        `${slide.duration}s`,
        slide.start ? dateToLocalISO(new Date(slide.start)) : "",
        slide.end ? dateToLocalISO(new Date(slide.end)) : "",
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

        const slide = {slideType: mv.typeValue, value: mv.valueValue};
        const newSlideData = {name: mv.nameValue, duration: mv.durationValue, active: mv.activeValue, start: new Date(mv.startValue).getTime(), end: new Date(mv.endValue).getTime(), bg: mv.bgValue, lastEdit: mv.lastEditValue, slide: slide};
        
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

        <DvetModal modalIsOpen={modalIsOpen} onModalClose={onModalClose}>
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
                        <option value="img">{isEnglish() ? "Image" : "Bild"}</option>
                        <option value="iframe">{isEnglish() ? "Website" : "Hemsida"}</option>
                        <option value="markdown">Markdown</option>
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

                <div className="row">
                    <label htmlFor="start">Start:</label>
                    <input name="start"
                        type="date"
                        min={dateToLocalISO(new Date())}
                        max={mv.endValue ? dateToLocalISO(new Date(mv.endValue)) : ""}
                        value={mv.startValue}
                        onChange={e => setModalValues(v => { return {...v, startValue: dateToLocalISO(new Date(e.target.value))} })} />
                    <span>({isEnglish() ? "optional" : "valfri"})</span>
                </div>

                <div className="row">
                    <label htmlFor="end">{isEnglish() ? "End" : "Slut"}:</label>
                    <input name="end"
                        type="date"
                        min={dateToLocalISO(mv.startValue ? new Date(mv.startValue) : new Date())}
                        value={mv.endValue}
                        onChange={e => setModalValues(v => { return {...v, endValue: mv.startValue ? (new Date(e.target.value) >= new Date(mv.startValue) ? dateToLocalISO(new Date(e.target.value)) : "") : e.target.value} })}
                    />
                    <span>({isEnglish() ? "optional" : "valfri"})</span>
                </div>

                { mv.typeValue === "img" &&
                    <div className="row">
                        <label htmlFor="bg">{isEnglish() ? "Colour" : "Färg"}:</label>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <input name="bg"
                                type="color"
                                value={mv.bgValue}
                                onChange={e => setModalValues(v => { return {...v, bgValue: e.target.value} })}
                            />
                            <a className="btn blue"
                                style={{margin: "0"}}
                                onClick={() => setModalValues(v => { return {...v, bgValue: "#1e242a"} })}>
                            RESET</a>
                        </div>
                        <div style={{gridColumn: "span 2"}}>
                            <span>({isEnglish() ? "tip: match the image background colour" : "tips: matcha bildens bakgrundsfärg"})</span>
                        </div>
                    </div>
                }

                <div className="row full">
                    { mv.typeValue === "markdown" ? <>
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

                { mv.typeValue === "img" &&
                    <div className="row">
                        <span></span>
                        <a className="btn blue" href="/photos/host" target="_blank">{isEnglish() ? "UPLOAD IMAGE" : "LADDA UPP BILD"}</a>
                    </div>
                }

                <button onClick={handleSubmit} className="btn blue">
                    {selectedSlideIndex != null ? (isEnglish() ? "UPDATE SLIDE" : "UPPDATERA SLIDE") : (isEnglish() ? "ADD SLIDE" : "LÄGG TILL")}
                </button>
            </form>
        </DvetModal>
    </>
};

const getDefaultState = () => {
    return {
        nameValue: "",
        typeValue: "img",
        valueValue: "",
        durationValue: 10,
        startValue: "",
        endValue: "",
        bgValue: "#1e242a",
        activeValue: true,
        lastEditValue: decodeJwt(Cookies.get("dv-token")).email
    }
};

const createColumns = () => [
    isEnglish() ? "Name" : "Namn",
    isEnglish() ? "Type" : "Typ",
    isEnglish() ? "Duration" : "Varaktighet",
    "Start",
    isEnglish() ? "End" : "Slut",
    isEnglish() ? "Active" : "Aktiv",
    "",
    "",
    isEnglish() ? "Edited by" : "Redigerad av"
];

export default me;
