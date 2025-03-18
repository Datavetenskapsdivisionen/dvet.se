if (path == "${name}") {
    return <main-wiki>
        <button onClick={showNavTree} class="show-tree-button">≡ Show Tree</button>
        <div id="navtree" class="wiki-navtree-root wiki-navtree-hidden"><button onClick={hideNavTree} className="close">X</button><div class="wiki-navtree-middle">{TREE}</div></div>
        <div className="page">
            { isEnglish() && ${!englishName} ? <p><em>(English version not available)</em></p> : <></> }
            <div id="wiki-page" dangerouslySetInnerHTML={{ __html: isEnglish() && ${englishName} ? ${englishName} : ${name} }}></div>
        </div>
    </main-wiki>;
} else 