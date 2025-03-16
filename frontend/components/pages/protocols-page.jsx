import React from "react";
import { useLoaderData } from "react-router-dom";
import { isEnglish } from "util";

const me = () => {
	const [items, setItems] = React.useState(useLoaderData());
	const [selectedFile, setSelectedFile] = React.useState(null);
	const [titleElem, setTitleElem] = React.useState(<p>No file has been selected</p>);
	const [pdfBase64, setPdfBase64] = React.useState(null);
	const openDirsRef = React.useRef(items.children && items.children.length > 0 ? { [items.children[0].path]: true } : {});

	return (
		<div className="page">
			<h1>{isEnglish() ? "Protocols" : "Protokoll"}</h1>
			<div className="protocols-page">
				<DocumentBrowser 
					items={items} 
					setSelectedFile={setSelectedFile} 
					setPdfBase64={setPdfBase64} 
					setTitleElem={setTitleElem} 
					openDirsRef={openDirsRef} 
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

const DocumentBrowser = ({ items, setSelectedFile, setPdfBase64, setTitleElem, openDirsRef }) => {
	const buildDocumentBrowser = (items) => {
		const fileExtensionFilter = [".typ", ".tex"];
		const filterFiles = (node) => {
			if (!node.children) {
				return fileExtensionFilter.some((ext) => node.name.endsWith(ext)) ? node : null;
			}
			const filteredChildren = node.children.map(filterFiles).filter(Boolean);
			return filteredChildren.length > 0 ? { ...node, children: filteredChildren } : null;
		};

		items = filterFiles(items);
		if (!items) {
			return <span>There are no documents</span>;
		}

		const onFileClick = (node) => {
			setPdfBase64(null);
			setSelectedFile(node);
			setTitleElem(<i>Fetching protocol...</i>);
			fetch("/api/protocols/pdf", { 
				method: "POST", 
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					path: node.path,
					type: node.path.split(".").at(-1),
					url: node.url,
				})
			})
			.then((res) => res.json())
			.then((res) => {
				const pdfBase64 = res.base64;
				setPdfBase64(pdfBase64);
				setTitleElem(<i>Loading PDF...</i>);
			})
			.catch(() => {
				setTitleElem(<p>Failed to fetch {node.name} from the server</p>);
			});
		};

		const toggleDir = (e, path) => {
			e.target.parentElement.children[1].classList.toggle("hidden");
			const isOpen = !e.target.parentElement.children[1].classList.contains("hidden");
			openDirsRef.current[path] = isOpen;
		};

		const traverseTree = (node, indentLevel = 0) => {
			if (!node.children || node.children.length === 0) {
				return (
					<span className="file" style={{ marginLeft: `${indentLevel}px` }} key={node.path} onClick={() => onFileClick(node)}>
						<FileIcon height="20px" />
						{node.name}
					</span>
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

		return traverseTree(items.children[0]);
	};

	return (
		<div className="document-browser">
			{buildDocumentBrowser(items)}
		</div>
	);
};

const DocumentViewer = ({ titleElem, pdfBase64, selectedFile, setTitleElem }) => {
	return (
		<div className="document-viewer">
			{titleElem}
			{ pdfBase64 &&
				<div className="doc">
					<embed
						key={selectedFile.name}
						type="application/pdf"
						src={`data:application/pdf;base64,${pdfBase64}#toolbar=0`}
						onLoad={() => setTitleElem(<h3>{selectedFile.name}</h3>)}
						onError={() => setTitleElem(<p>Failed to load PDF</p>)}
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

export default me;
