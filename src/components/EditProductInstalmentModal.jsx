import React, { useEffect, useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, FormGroup, Input, Label } from "reactstrap";

const EditProductInstalmentModal = (props) => {

    const [title, setTitle] = useState("");
    const [advance, setAdvance] = useState("");
    const [amount, setAmount] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [month, setMonth] = useState("");

    const addProductInstallment = () => {
        let formData = new URLSearchParams();

        formData.append('installment_title', title);
        formData.append('advance', advance);
        formData.append('amount', amount);
        formData.append('total_amount', totalAmount);
        formData.append('duration', month);
        formData.append('duration_type', "%");
        formData.append('status', 1);
        formData.append('product_type_id', props?.data?.product_type_id);
        formData.append('product_id', props?.data?.product_id);
        formData.append('id', props?.data?.id);

        props?.action(formData);
    };

    useEffect(() => {
        if (props?.data) {
            setTitle(props?.data?.installment_title);
            setAdvance(props?.data?.advance);
            setAmount(props?.data?.amount);
            setTotalAmount(props?.data?.total_amount);
            setMonth(props?.data?.duration);
        }
    }, [props?.data]);

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseEditInstallmentModal}
        >
            <Modal.Body className="overflow p-4">
                <Label for="exampleEmail"><b>Title</b></Label>
                <Input type="text" className="mb-3" value={title} onChange={(e) => setTitle(e.target.value)} />

                <Label for="exampleEmail"><b>Advance</b></Label>
                <Input type="number" className="mb-3" value={advance} onChange={(e) => setAdvance(e.target.value)} />

                <Label for="exampleEmail"><b>Amount</b></Label>
                <Input type="number" className="mb-3" value={amount} onChange={(e) => setAmount(e.target.value)} />

                <Label for="exampleEmail"><b>Total Amount</b></Label>
                <Input type="number" className="mb-3" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />

                <Label for="exampleEmail"><b>Month(s)</b></Label>
                <Input type="number" className="mb-3" value={month} onChange={(e) => setMonth(e.target.value)} />

                <div className="text-center">
                    <Button
                        className='mt-4'
                        onClick={addProductInstallment}
                    >Update Plan</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default EditProductInstalmentModal;