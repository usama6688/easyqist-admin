import React, { useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, FormGroup, Input, Label } from "reactstrap";

const SortBannerModal = (props) => {

    const [order, setOrder] = useState("");

    const onSort = () => {
        const data = {
            bannerId: props?.data?.id,
            sortOrder: order,
        }
        props?.action(data);
    };

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseSortBannerModal}
        >
            <Modal.Body className="overflow p-4">
                <FormGroup>
                    <Label for="exampleEmail">Sort Number</Label>
                    <Input name="name" placeholder="Sort number.." type="number" value={order}
                        onChange={(e) => setOrder(e.target.value)} />
                </FormGroup>

                <div className="text-center">
                    <Button
                        className='mt-4 w-25'
                        onClick={onSort}
                        loading={props?.loading}
                    >Sort</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default SortBannerModal;