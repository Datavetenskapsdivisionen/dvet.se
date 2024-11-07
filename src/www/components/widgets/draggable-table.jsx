import React from "react";
import invariant from "tiny-invariant";
import { draggable, dropTargetForElements, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

/**
 * DraggableTable component renders a table with draggable rows.
 * 
 * @component
 * @param {string[]} props.columns - Array of column headers.
 * @param {Array.<Array.<React.ReactNode>>} [props.rows] - Array of rows, each row is an array of cells.
 * @param {function} [props.onMove] - Callback function to handle row move, receives source and destination indices.
 * 
 * @example
 * const columns = ["Name", "Age", "Address"];
 * const rows = [
 *   ["Megaman Andersson", 28, "Rännvägen 6"],
 *   ["Protoman Svensson", 34, "Rännvägen 8"]
 * ];
 * const handleMove = (sourceIndex, destIndex) => {
 *   console.log(`Moved row from ${sourceIndex} to ${destIndex}`);
 * };
 * 
 * <DraggableTable columns={columns} rows={rows} onMove={handleMove} />
 */
const DraggableTable = (props) => {
    invariant(props.columns, "Columns are required");
    const columns = props.columns;
    const rows = props.rows || [];
    const onMove = props.onMove || (() => {});

    React.useEffect(() => {
        monitorForElements({
            onDrop({ source, location }) {
                const dest = location.current.dropTargets[0];
                if (!dest) { return; }
        
                const sourceIndex = source.data.elementIndex;
                const destIndex = dest.data.elementIndex;
        
                onMove(sourceIndex, destIndex);
            }
        });
    }, []);

    const SlideRow = (props) => {
        const row = props.row;
        const index = props.index;

        const [dragged, setDragged] = React.useState(false);
        const [draggedOver, setDraggedOver] = React.useState(false);
        
        const rowRef = React.useRef(null);
        const dragRef = React.useRef(null);

        React.useEffect(() => {
            invariant(row);
            draggable({
                element: rowRef.current,
                dragHandle: dragRef.current,
                getInitialData: () => ({ elementIndex: index }),
                onDragStart: () => setDragged(true),
                onDrop: () => setDragged(false)
            });
            dropTargetForElements({
                element: rowRef.current,
                getData: () => ({ elementIndex: index }),
                onDragEnter: () => setDraggedOver(true),
                onDragLeave: () => setDraggedOver(false),
                onDrop: () => setDraggedOver(false)
            });
        }, [props]);

        return (
            <tr
                key={index}
                ref={rowRef}
                className={(dragged ? "dragged " : "") + (draggedOver ? "dragged-over" : "")}
            >
                <td key={"drag-handle"} ref={dragRef}><DragHandleIcon /></td>
                {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                ))}
            </tr>
        );
    };

    return (
        <div className="draggable-table-container">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => <SlideRow key={index} row={row} index={index} />)}
                </tbody>
            </table>
        </div>
    );
};

const DragHandleIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" role="presentation">
        <g fill="currentColor" fillRule="evenodd">
            <circle cx="10" cy="8"  r="1" />
            <circle cx="14" cy="8"  r="1" />
            <circle cx="10" cy="16" r="1" />
            <circle cx="14" cy="16" r="1" />
            <circle cx="10" cy="12" r="1" />
            <circle cx="14" cy="12" r="1" /> 
        </g>
    </svg>
);

export default DraggableTable;
