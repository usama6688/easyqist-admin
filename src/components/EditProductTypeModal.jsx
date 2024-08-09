import React, { useEffect, useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, FormGroup, Input, Label } from "reactstrap";

const EditProductTypeModal = (props) => {

    const [title, setTitle] = useState("");

    const addProductType = () => {
        let formData = new URLSearchParams();

        formData.append('title', title);
        formData.append('product_id', props?.data?.product_id);
        formData.append('id', props?.data?.id);

        props?.action(formData);
    };

    useEffect(() => {
        if (props?.data) {
            setTitle(props?.data?.title);
        }
    }, [props?.data]);

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseEditProductTypeModal}
        >
            <Modal.Body className="overflow p-4">
                <FormGroup>
                    <Label for="exampleEmail">Type Name</Label>
                    <Input name="name" placeholder="Name" type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                </FormGroup>

                <div className="text-center">
                    <Button
                        className='mt-4 w-25'
                        onClick={addProductType}
                    >Update</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default EditProductTypeModal;