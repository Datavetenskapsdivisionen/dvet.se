import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { isEnglish } from "util";
const hideTree = (buttonId, divId) => {
    const button = document.getElementById(buttonId);
    const div = document.getElementById(divId);
    if (div.style.display == "block") {
        div.style.display = "none";
        button.innerText = button.innerText.slice(0, -1);
        button.innerText = button.innerText + " ⇓";
    } else {
        div.style.display = "block";
        button.innerText = button.innerText.slice(0, -1);
        button.innerText = button.innerText + " ⇑";
    }
};

const hideNavTree = () => {
    const navtree = document.getElementById("navtree");
    navtree.classList.add("wiki-navtree-hidden");
};

const showNavTree = () => {
    const navtree = document.getElementById("navtree");
    navtree.classList.remove("wiki-navtree-hidden");
};
