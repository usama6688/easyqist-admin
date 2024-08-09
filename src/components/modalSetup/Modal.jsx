import React from 'react';
import './Modal.css';
import { Modal } from "react-bootstrap";

const SmallModal = ({ show, size, icon, title, handleClose, children, className, closeBtn = true, customHeader = null }) => {
    return (
        <Modal
            size={size}
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            className={className}
            centered
        >
            {closeBtn &&
                <Modal.Header
                // closeButton={customHeader ? false : 'closeButton'}
                >

                    <Modal.Title className="d-flex" >
                        <img src={icon} alt="" className='mr-2' />
                        <h5 className="title fontsize-15">{title}</h5>
                    </Modal.Title>

                    <div className="d-flex align-items-center">
                        {customHeader ? customHeader : ''}
                        <button type="button" className="btn-close xx" aria-label="Close" onClick={handleClose} onHide={handleClose} />
                    </div>

                    {/* {customHeader ?
                    <div className="d-flex align-items-center">
                        {customHeader ? customHeader : ''}
                        <button type="button" className="btn-close xx" aria-label="Close" onClick={handleClose} onHide={handleClose} />
                    </div>
                    : ''} */}
                </Modal.Header>
            }
            {children}
        </Modal>
    )
}

export default SmallModal;