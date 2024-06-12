import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Provider, useSelector, useDispatch } from "react-redux";
import { isEnglish } from "../util";
import { createSlice, configureStore } from "@reduxjs/toolkit";

const STATE_KEY = "dv-sittning-editor-state";

class PageData {
    /**
    * Represents a page.
    * @constructor
    * @param {Number} index - The page index.
    */
    constructor(index) {
        this.index = index;
        this.debugText = `dbg-${Math.floor(Math.random() * 1000)}`;
    }
}

const storeState = (state) => {
    const json = JSON.stringify(state);
    console.log(`Storing: ${json}`);
    const stateStr = encodeURI(json);
    localStorage.setItem(STATE_KEY, stateStr);
};

/**
 * @returns {{pages: PageData[]}}
 */
const initState = () => {
    const stateStr = localStorage.getItem(STATE_KEY);
    if (stateStr) {
        const decodedState = decodeURI(stateStr);
        console.log(`Loading: ${decodedState}`);
        return JSON.parse(decodedState);
    } else {
        return {
            pages: []
        };
    }
};

const stateSlice = createSlice({
    name: 'State',
    initialState: initState(),
    reducers: {
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
            state.pages.splice(index - 1, 1);

            storeState(state);
        }
    }
});
const { newPage, removePage } = stateSlice.actions;

const store = configureStore({
    reducer: stateSlice.reducer
});

const SongList = () => {
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
            return <li key={key}>
                <button>{key}</button>
            </li>;
        })}</ul>
        : <>Loading songs...</>;

    return <div>
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
    const indexClass = pageData.index % 2 ? "page-index-right" : "page-index-left";
    const dispatch = useDispatch();

    const clickRemove = () => {
        dispatch(removePage(pageData.index));
    };

    return <div className="editor-page">
        <div className="editor-tools">
            <button>⇑</button>
            <button>⇓</button>
            <button onClick={clickRemove}>Remove</button>
        </div>
        <div className="editor-page-content">
            <a className={indexClass}>{pageData.index}</a>
            <a className="page-debug-text">{pageData.debugText}</a>
        </div>
    </div>;
};

const Options = () => {
    /** @type {Array.<PageData>} */
    const pages = useSelector(state => state.pages);
    const dispatch = useDispatch();

    return <div>
        <h2>Options</h2>
        <button onClick={() => dispatch(newPage())}>New page</button>
    </div>;
};


const EDITOR_AREA = "editor-area";
const Editor = () => {
    /** @type {Array.<PageData>} */
    const pages = useSelector(state => state.pages);
    // const dispatch = useDispatch();

    return <div>
        <h2>Sittning - Editor</h2>
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