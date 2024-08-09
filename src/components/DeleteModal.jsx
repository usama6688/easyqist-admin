import React from "react";
import ModalComponent from "../components/modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button } from "reactstrap";

const DeleteModal = (props) => {

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseDeletModal}
        >
            <Modal.Body className="overflow p-4">
                <div className="d-flex align-items-center justify-content-between">
                    <h2 className="modalLabel text-center">{props?.confirmationMessage}
                        {/* <span className="text-danger text-capitalize">{props?.name}</span>? {props?.warningMessage} */}
                    </h2>
                </div>

                <div className="text-center">
                    <Button
                        className='mt-4 w-25'
                        onClick={() => {
                            props?.action(props?.id)
                        }}
                    >Confirm</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default DeleteModal;