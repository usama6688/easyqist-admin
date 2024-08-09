import React, { useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, FormGroup, Input, Label } from "reactstrap";

const AddPaymentModal = (props) => {

    const [amount, setAmount] = useState("");

    const onAddPayment = () => {

        let formData = new URLSearchParams();

        formData.append('amount', amount);
        formData.append('user_id', props?.data?.user_id);
        formData.append('order_id', props?.data?.order_id);
        formData.append('order_product_id', props?.data?.product_id);
        formData.append('order_installment_id', props?.data?.order_product_installment_id);
        formData.append('fullamount', 0);
        formData.append('order_product_type_id', props?.data?.order_product_type_id);

        props?.action(formData);
    };

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseAddPaymentModal}
        >
            <Modal.Body className="overflow p-4">
                <FormGroup>
                    <Label for="exampleEmail">Amount</Label>
                    <Input name="name" placeholder="Type.." type="number" value={amount}
                        onChange={(e) => setAmount(e.target.value)} />
                </FormGroup>

                <div className="text-center">
                    <Button
                        className='mt-4 w-25'
                        onClick={onAddPayment}
                        loading={props?.loading}
                    >Add</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default AddPaymentModal;