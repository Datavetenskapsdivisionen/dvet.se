import React, { useEffect } from "react";
import text from "/frontend/faq-cache/faq.html";
import textEn from "/frontend/faq-cache/faq-en.html";
import { isEnglish } from "util";

const me = () => {
    useEffect(() => {
        const buttons = document.getElementsByClassName("faq-expand-button");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons.item(i);
            const arrow = button.children.item(1);
            // :)
            const content = button.parentElement.nextElementSibling;
            const max = content.scrollHeight + "px";
            button.addEventListener('click', () => {
                if (content.style.height == max) {
                    content.style.height = "0";
                    arrow.innerHTML = "▼";
                } else {
                    content.style.height = max;
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
