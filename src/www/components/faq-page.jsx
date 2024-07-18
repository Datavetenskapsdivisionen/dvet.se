import React, { useEffect } from "react";
import text from "../../../faq-cache/faq.html";
import textEn from "../../../faq-cache/faq-en.html";
import { isEnglish } from "../util";

const me = () => {
    useEffect(() => {
        const buttons = document.getElementsByClassName("faq-expand-button");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons.item(i);
            const arrow = button.children.item(1);
            // :)
            const content = button.parentElement.nextElementSibling;
            button.addEventListener('click', () => {
                if (content.style.gridTemplateRows == "1fr") {
                    content.style.gridTemplateRows = "0fr";
                    arrow.innerHTML = "▼";
                } else {
                    content.style.gridTemplateRows = "1fr";
                    arrow.innerHTML = "▲";
                }
            });
        }
    }, []);
    return <div className="page">
        <div
            className="faq-page"
            dangerouslySetInnerHTML={{ __html: isEnglish() ? textEn : text }}>
        </div>
    </div>;
};

export default me;
