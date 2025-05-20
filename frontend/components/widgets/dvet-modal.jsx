import React from "react";
import Modal from "react-modal";

/**
 * Render a modal dialog using the `react-modal` library.
 *
 * @component
 * @param {Object}    props                  - The properties object.
 * @param {Boolean}   props.modalIsOpen      - The state of the modal.
 * @param {Function} [props.onModalOpen]     - Optional callback function to be called when the modal is opened.
 * @param {Function} [props.onModalClose]    - Optional callback function to be called when the modal is closed.
 * @param {Boolean}  [props.hideCloseButton] - Optional flag to hide the close button in the modal.
 *
 * @example
 * <DvetModal modalIsOpen={isOpen} onModalClose={() => console.log('Modal closed')} />
 */
const me = (props) => {
    if (props.modalIsOpen === undefined) {
        throw Error("Expected `modalIsOpen` to be defined.");
    }

    const onOpen = () => {
        props.onModalOpen?.();
    }

    const onClose = () => {
        props.onModalClose?.();
    }
    
    return <Modal
        isOpen={props.modalIsOpen}
        onAfterOpen={onOpen}
        onRequestClose={onClose}
        appElement={document.getElementById("app")}
        className={`dvet-modal ${props.className || ""}`.trim()}
        overlayClassName="dvet-modal-overlay"
    >
        {props.hideCloseButton ? null : <button onClick={onClose} className="close-button">X</button>}
        {props.children}
    </Modal>
};

export default me;
