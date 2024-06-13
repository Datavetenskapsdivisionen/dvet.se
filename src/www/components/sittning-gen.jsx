import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Provider, useSelector, useDispatch } from "react-redux";
import { isEnglish } from "../util";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";

const STATE_KEY = "dv-sittning-editor-state";

class PageChild {
    /** @type {string} */
    htmlContent;
    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    h;
    /** @type {number} */
    w;
    constructor(htmlContent) {
        this.htmlContent = htmlContent;
        this.x = 0;
        this.y = 0;
        this.h = 200;
        this.w = 200;
    }
}

class PageData {
    /** @type {Array<PageChild>} */
    children;
    /**
    * Represents a page.
    * @constructor
    * @param {Number} index - The page index.
    */
    constructor(index) {
        this.index = index;
        this.debugText = `dbg-${Math.floor(Math.random() * 1000)}`;
        this.children = {};
    }
}

const storeState = (state) => {
    const json = JSON.stringify(state);
    console.log(`Storing: ${json}`);
    const stateStr = encodeURI(json);
    localStorage.setItem(STATE_KEY, stateStr);
};

/**
 * @returns {{pages: PageData[], focus: number|null}}
 */
const initState = () => {
    const stateStr = localStorage.getItem(STATE_KEY);
    if (stateStr) {
        const decodedState = decodeURI(stateStr);
        console.log(`Loading: ${decodedState}`);
        return JSON.parse(decodedState);
    } else {
        return {
            pages: [],
            focus: null
        };
    }
};

const stateSlice = createSlice({
    name: 'State',
    initialState: initState(),
    reducers: {
        moveChild: (state, payload) => {
            const [parent, child, x, y] = payload.payload;

            state.pages[parent - 1].children[child].x = x;
            state.pages[parent - 1].children[child].y = y;

            storeState(state);
        },
        resizeChild: (state, payload) => {
            const [parent, child, w, h] = payload.payload;

            state.pages[parent - 1].children[child].h += h;
            state.pages[parent - 1].children[child].w += w;

            storeState(state);
        },
        removeChild: (state, payload) => {
            const [parent, child] = payload.payload;

            delete state.pages[parent - 1].children[child];

            storeState(state);
        },
        addSong: (state, payload) => {
            const song = payload.payload;
            const stamp = "song-" + Math.floor(Math.random() * 100000);
            if (state.focus && state.pages[state.focus - 1]) {
                state.pages[state.focus - 1].children[stamp] = new PageChild(song);
            }
            storeState(state);
        },

        focus: (state, payload) => {
            const index = payload.payload;
            state.focus = index;
        },
        newPage: state => {
            let index = state.pages.length + 1;
            state.pages.push(new PageData(index));
            storeState(state);
        },
        removePage: (state, payload) => {
            const index = payload.payload;

            for (let i = index; i < state.pages.length; i++) {
                state.pages[i].index -= 1;
            }
            if (state.focus > index) state.focus -= 1;
            state.pages.splice(index - 1, 1);

            storeState(state);
        },
        movePage: (state, payload) => {
            const [indexT, dir] = payload.payload;
            const index = indexT - 1;
            const otherIndex = index + dir;
            if (otherIndex < 0) return;
            if (otherIndex >= state.pages.length) return;

            let a = state.pages[index];
            let b = state.pages[otherIndex];
            a.index = otherIndex + 1;
            b.index = index + 1;
            state.pages[otherIndex] = a;
            state.pages[index] = b;

            storeState(state);
        },
    }
});
const {
    newPage, removePage,
    movePage, focus,
    addSong, removeChild,
    moveChild, resizeChild } = stateSlice.actions;

const store = configureStore({
    reducer: stateSlice.reducer
});

const SongList = () => {
    const dispatch = useDispatch();
    const [list, setList] = useState(null);
    useEffect(() => {
        fetch("/sittning/api", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Cookies.get("dv-token")}`
            }
        })
            .then(r => r.json())
            .then(r => setList(r))
            .catch(e => console.error(e));
    }, []);

    const elem = list
        ? <ul>{Object.keys(list).map(key => {
            const songClick = () => {
                dispatch(addSong(list[key]));
            };

            return <li key={key}>
                <button onClick={songClick}>{key}</button>
            </li>;
        })}</ul>
        : <>Loading songs...</>;

    return <div className="editor-song-list">
        <h2>{isEnglish() ? "Song List" : "Låt Lista"}</h2>
        {elem}
    </div>;
};

/**
 * Renders a page.
 * @constructor
 * @param {{pageData: PageData}} pageData - The page data.
 */
const Page = ({ pageData }) => {
    /** @type {number|null} */
    const focusedIndex = useSelector(state => state.focus);
    const contentClass = focusedIndex == pageData.index
        ? "editor-page-content editor-page-content-focused"
        : "editor-page-content";

    const indexClass = pageData.index % 2
        ? "page-index-right"
        : "page-index-left";
    const dispatch = useDispatch();

    const clickRemove = () => {
        dispatch(removePage(pageData.index));
    };

    const moveUp = () => {
        dispatch(movePage([pageData.index, -1]));
    };

    const moveDown = () => {
        dispatch(movePage([pageData.index, 1]));
    };

    const onFocus = () => {
        dispatch(focus(pageData.index));
    };

    const upArrow = pageData.index % 2 == 0
        ? "⇐" : "⇗";
    const downArrow = pageData.index % 2 == 0
        ? "⇙" : "⇒";

    return <div className="editor-page">
        <div className="editor-tools">
            <button onClick={onFocus}>Focus</button>
            <button onClick={moveUp}>{upArrow}</button>
            <button onClick={moveDown}>{downArrow}</button>
            <button onClick={clickRemove}>Remove</button>
        </div>
        <div className={contentClass}>
            <a className={indexClass}>{pageData.index}</a>
            <a className="page-debug-text">{pageData.debugText}</a>
            {Object.keys(pageData.children).map(s => {
                const onDrop = (e, d) => {
                    dispatch(moveChild([pageData.index, s, d.x, d.y]));
                };

                const x = pageData.children[s].x ? pageData.children[s].x : 0;
                const y = pageData.children[s].y ? pageData.children[s].y : 0;
                const h = pageData.children[s].h;
                const w = pageData.children[s].w;

                return <Draggable
                    scale={0.5}
                    defaultPosition={{ x: x, y: y }}
                    bounds="parent"
                    onStop={onDrop}
                >
                    <Resizable
                        onResizeStop={(e, direction, ref, d) => {
                            dispatch(resizeChild([pageData.index, s, d.width, d.height]));
                        }}
                        defaultSize={{
                            width: w,
                            height: h
                        }}
                        scale={0.5}
                    >
                        <div
                            id={s}
                            className="sittning-item"
                        >
                            <button onClick={() => {
                                dispatch(removeChild([pageData.index, s]));
                            }}>X</button>
                            <div
                                dangerouslySetInnerHTML={{ __html: pageData.children[s].htmlContent }}
                            />
                        </div>
                    </Resizable>
                </Draggable>;
            })}
        </div>
    </div >;
};

const Options = () => {
    /** @type {Array.<PageData>} */
    const pages = useSelector(state => state.pages);
    const dispatch = useDispatch();

    return <div className="editor-options">
        <h2>Options</h2>
        <button onClick={() => dispatch(newPage())}>New page</button>
        <input type="text" placeholder="image-url" id="sittning-image-url" />
        <button onClick={() => {
            const val = document.getElementById("sittning-image-url").value;
            const img = `<img src="${val}" alt="failed to grab image!"/>`;
            dispatch(addSong(img));
        }}>Add image</button>
    </div>;
};

// document.querySelector(":root").style.setProperty("--sittning-multiplier", 2);

const EDITOR_AREA = "editor-area";
const Editor = () => {
    /** @type {Array.<PageData>} */
    const pages = useSelector(state => state.pages);
    // const dispatch = useDispatch();

    return <div>
        <div className="hor-center">
            <div id={EDITOR_AREA} className="editor-area">
                {pages.map(d => <Page pageData={d}></Page>)}
            </div>
        </div>
    </div>;
};

const me = () => {
    return <main-sittning>
        <Provider store={store}>
            <Editor />
            <Options />
            <SongList />
        </Provider>
    </main-sittning>;
};

export default me;