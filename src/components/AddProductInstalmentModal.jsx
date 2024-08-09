import React, { useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, Input, Label } from "reactstrap";

const AddProductInstalmentModal = (props) => {

    const [title, setTitle] = useState("");
    const [advance, setAdvance] = useState("");
    const [amount, setAmount] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [month, setMonth] = useState("");

    const addProductType = () => {
        let formData = new URLSearchParams();

        formData.append('installment_title', title);
        formData.append('advance', advance);
        formData.append('amount', amount);
        formData.append('total_amount', totalAmount);
        formData.append('duration', month);
        formData.append('duration_type', "%");
        formData.append('status', 1);
        formData.append('product_type_id', props?.data?.id);
        formData.append('product_id', props?.data?.product_id);

        props?.action(formData);
    };

    console.log("props?.data", props?.data);

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseAddInstalmentModal}
        >
            <Modal.Body className="overflow p-4">
                <Label for="exampleEmail"><b>Title</b></Label>
                <Input type="text" placeholder="Type.." className="mb-3" value={title} onChange={(e) => setTitle(e.target.value)} />

                <Label for="exampleEmail"><b>Advance</b></Label>
                <Input type="number" placeholder="Type.." className="mb-3" value={advance} onChange={(e) => setAdvance(e.target.value)} />

                <Label for="exampleEmail"><b>Amount</b></Label>
                <Input type="number" placeholder="Type.." className="mb-3" value={amount} onChange={(e) => setAmount(e.target.value)} />

                <Label for="exampleEmail"><b>Total Amount</b></Label>
                <Input type="number" placeholder="Type.." className="mb-3" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />

                <Label for="exampleEmail"><b>Month(s)</b></Label>
                <Input type="number" placeholder="Type.." className="mb-3" value={month} onChange={(e) => setMonth(e.target.value)} />

                <div className="text-center">
                    <Button
                        className='mt-4'
                        onClick={addProductType}
                    >Add Plan</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default AddProductInstalmentModal;