import React from "react";
import { NavLink, useLoaderData } from "react-router-dom";
import { isEnglish } from "util";

const me = () => {
	const [items, setItems] = React.useState(useLoaderData());
	const [selectedFile, setSelectedFile] = React.useState(null);
	const [titleElem, setTitleElem] = React.useState(<p>{isEnglish() ? "No protocol has been selected" : "Inget protokoll har valts"}</p>);
	const [pdfBase64, setPdfBase64] = React.useState(null);
	const [sortAsc, setSortAsc] = React.useState(true);
	const openDirsRef = React.useRef(items.children ? { [items.children[0].path]: true } : {});

	const loadNode = (node) => {
		setPdfBase64(null);
		setSelectedFile(node);
		setTitleElem(<i>{isEnglish() ? "Fetching protocol..." : "Hämtar protokoll..."}</i>);
		fetchPDF(node).then((res) => {
			const pdfBase64 = res.base64;
			setPdfBase64(pdfBase64);
			setTitleElem(<i>{isEnglish() ? "Loading PDF..." : "Laddar in PDF..."}</i>);
		}).catch(() => {
			setTitleElem(<p>{isEnglish() ? `Failed to fetch ${node.name} from the server` : `Misslyckades med att hämta ${node.name} från servern`}</p>);
		});
	};

	React.useEffect(() => {
		const requestedPath = decodeURIComponent(window.location.pathname.split("/").slice(2).join("/"));
		if (requestedPath) {
			const findNode = (node, path) => {
				if (node.path === path) return node;
				if (node.children) {
					for (let child of node.children) {
						const result = findNode(child, path);
						if (result) return result;
					}
				}
				return null;
			};

			const node = findNode(items, requestedPath);
			if (!node) {
				setTitleElem(<p>{isEnglish() ? "Protocol not found" : "Protokollet hittades inte"}</p>);
				return;
			};

			const pathParts = node.path.split("/").map((part, i, arr) => arr.slice(0, i + 1).join("/"));
			pathParts.forEach((part) => openDirsRef.current[part] = true);

			if (node.type === "file") {
				loadNode(node);
			} else {
				setSelectedFile(null);
				setPdfBase64(null);
				setTitleElem(<p>{isEnglish() ? "No protocol has been selected" : "Inget protokoll har valts"}</p>);
			}
		}
	}, []);

	return (
		<div className="page">
			<h1>{isEnglish() ? "Protocols" : "Protokoll"}</h1>
			<div className="protocols-page">
				<DocumentBrowser 
					items={items}
					openDirsRef={openDirsRef}
					loadNode={loadNode}
					sortAsc={sortAsc}
					setSortAsc={setSortAsc}
				/>
				<DocumentViewer 
					titleElem={titleElem} 
					pdfBase64={pdfBase64} 
					selectedFile={selectedFile} 
					setTitleElem={setTitleElem} 
				/>
			</div>
		</div>
	);
};

const fetchPDF = async (node) => {
	return await fetch("/api/protocols/pdf", { 
		method: "POST", 
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			path: node.path,
			type: node.path.split(".").at(-1),
			url: node.url,
		})
	}).then((res) => res.json());
};

const DocumentBrowser = ({ items, openDirsRef, loadNode, sortAsc, setSortAsc }) => {
	const buildDocumentBrowser = (items) => {
		const fileExtensionFilter = [".typ", ".tex"];
		const filterFiles = (node) => {
			if (!node.children) {
				return fileExtensionFilter.some((ext) => node.name.endsWith(ext)) ? node : null;
			}

			node.children.forEach(n => {
				const ext = n.name.split(".").at(-1);
				if (n.type === "file" && ext !== "url") {
					const urlNode = node.children.find(x => x && x.name.split(".")[0] === n.name.split(".")[0] && x.name.split(".").at(-1) === "url");
					if (urlNode) { n.scanUrlBlob = urlNode; }
				}
			});
			const filteredChildren = node.children.map(filterFiles).filter(Boolean);
			return filteredChildren.length > 0 ? { ...node, children: sortAsc ? filteredChildren : filteredChildren.reverse() } : null;
		};

		items = filterFiles(items);
		if (!items) {
			return <span>{isEnglish() ? "There are no protocols" : "Det finns inga protokoll"}</span>;
		}

		const onFileClick = (node) => {
			loadNode(node);
		};

		const toggleDir = (e, path) => {
			e.currentTarget.parentElement.children[1].classList.toggle("hidden");
			const isOpen = !e.currentTarget.parentElement.children[1].classList.contains("hidden");
			openDirsRef.current[path] = isOpen;
		};

		const traverseTree = (node, indentLevel = 0) => {
			if (!node.children || node.children.length === 0) {
				return (
					<NavLink to={node.path} className="file" style={{ marginLeft: `${indentLevel}px` }} key={node.path} onClick={() => onFileClick(node)}>
						<FileIcon height="20px" />
						{node.name}
					</NavLink>
				);
			}

			const isOpen = openDirsRef.current[node.path] || false;
			return (
				<div style={{ marginLeft: `${indentLevel}px` }} key={node.sha}>
					<span className="dir" onClick={(e) => toggleDir(e, node.path)}>
						<DirectoryIcon height="20px" />
						{node.name}
					</span>
					<div className={isOpen ? "" : "hidden"}>
						{node.children.map((child) =>
							traverseTree(child, indentLevel + 8)
						)}
					</div>
				</div>
			);
		};
		
		return <>
			<AlphabeticalSortIcon id="sort-button" height="30px" sortAsc={sortAsc} onClick={() => setSortAsc(!sortAsc)} />
			{traverseTree(items.children[0])}
		</>;
	};

	return (
		<div className="document-browser">
			{buildDocumentBrowser(items)}
		</div>
	);
};

const DocumentViewer = ({ titleElem, pdfBase64, selectedFile, setTitleElem }) => {
	const fetchSignedURL = async (node) => {
		if (!node.scanUrlBlob) { return; }
		const scanUrl = await fetch(node.scanUrlBlob.url).then((res) => res.json()).then((data) => atob(data.content));
		window.open(scanUrl, "_blank");
	};

	return (
		<div className="document-viewer">
			<div className="title-row">
				{ titleElem }
				{ selectedFile && selectedFile.scanUrlBlob
					? <a href="#" id="signed" className="hidden" onClick={() => fetchSignedURL(selectedFile)}>{isEnglish() ? "Signed" : "Signerad"} ✅</a>
					: <span id="signed" className="hidden">{isEnglish() ? "Not signed" : "Ej signerad"} ❌</span>
				}
			</div>
			{ pdfBase64 &&
				<div className="doc">
					<embed
						key={selectedFile.name}
						type="application/pdf"
						src={`data:application/pdf;base64,${pdfBase64}#toolbar=0`}
						onLoad={() => {
							setTitleElem(<h3>{selectedFile.name}</h3>);
							document.getElementById("signed")?.classList.remove("hidden");
						}}
						onError={() => setTitleElem(<p>{isEnglish() ? "Failed to load the PDF" : "Misslyckades med att ladda in PDF:en"}</p>)}
						width="100%"
						height="900px"
					/>
				</div>
			}
		</div>
	);
};

const DirectoryIcon = (props) => (
	<svg style={{ fill: props.color || "#3daee9", height: props.height || "20px", width: "auto" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M0 0h24v24H0z" fill="none" />
		<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
	</svg>
);

const FileIcon = (props) => (
	<svg style={{ fill: props.color || "#3daee9", height: props.height || "20px", width: "auto"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
		<path d="M77.474 17.28L61.526 1.332C60.668.473 59.525 0 58.311 0H15.742c-2.508 0-4.548 2.04-4.548 4.548v80.904c0 2.508 2.04 4.548 4.548 4.548h58.516c2.508 0 4.549-2.04 4.549-4.548V20.496c0-1.215-.474-2.358-1.333-3.216zM61.073 5.121l12.611 12.612H62.35a1.28 1.28 0 0 1-1.276-1.277V5.121zM74.258 87H15.742a1.55 1.55 0 0 1-1.548-1.548V4.548A1.55 1.55 0 0 1 15.742 3h42.332v13.456c0 2.358 1.918 4.277 4.276 4.277h13.457v64.719A1.55 1.55 0 0 1 74.258 87zm-6.065-53.681H41.808a1.5 1.5 0 1 1 0-3h26.385a1.5 1.5 0 1 1 0 3zm-33.737 0H21.807a1.5 1.5 0 1 1 0-3h12.649a1.5 1.5 0 1 1 0 3z"/>
		<path d="M-10.246 0h20.492" />
		<g>
			<path d="M42.298 20.733H21.807a1.5 1.5 0 1 1 0-3h20.492a1.5 1.5 0 1 1-.001 3z" />
			<path d="M48.191 55.319H21.807a1.5 1.5 0 1 1 0-3h26.385a1.5 1.5 0 1 1-.001 3z" />
		</g>
	</svg>
);

const AlphabeticalSortIcon = (props) => (
	(props.sortAsc === undefined || props.sortAsc)
	? <svg id={props.id} onClick={props.onClick} style={{ height: props.height || "35px", width: "auto" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
		<polyline fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" points="12,15 12,14 9.1,6 8.9,6 6,14 6,15 "/>

		<line fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" x1="6" y1="12" x2="12" y2="12"/>
		<polyline fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" points="5,18 12,18 12,19 6,25 6,26 13,26 "/>

		<line fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" x1="23" y1="26.1" x2="23" y2="5"/>
		<polyline fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" points="18.7,21.8 23,26.1 27.3,21.8 "/>
	</svg>
	: <svg id={props.id} onClick={props.onClick} style={{ height: props.height || "35px", width: "auto" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
		<line fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" x1="23" y1="27.1" x2="23" y2="6"/>
		<polyline fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" points="18.7,10.1 23,5.8 27.3,10.1"/>
		<polyline fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" points="12,15 12,14 9.1,6 8.9,6 6,14 6,15"/>
		<line fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" x1="6" y1="12" x2="12" y2="12"/>
		<polyline fill="none" stroke={props.color || "var(--text-color-faint)"} strokeWidth="2" strokeMiterlimit="10" points="5,18 12,18 12,19 6,25 6,26 13,26"/>
	</svg>
);

export default me;
