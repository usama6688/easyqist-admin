import React, { useEffect, useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { useGetCustomersQuery } from "../services/Api";
import { MultiSelect } from "./MultiSelect";

const SendMessageModal = (props) => {

    const [message, setMessage] = useState("");
    const [selectedPhones, setSelectedPhones] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    const {
        data: getCustomers,
        refetch: getCustomersRefetch,
    } = useGetCustomersQuery();

    const onSendMessage = () => {

        let formData = new URLSearchParams();

        selectedData?.forEach((data, index) => {
            formData.append(`phone[${index}]`, data);
        });

        formData.append('msg', message);

        props?.action(formData);
    };

    const options = getCustomers?.data?.map(item => ({
        label: item?.custname,
        value: item?.phone
    }));

    const handleChange = (selectedOptions) => {
        const phones = selectedOptions?.map(option => option?.value);
        setSelectedData(phones);
    };

    useEffect(() => {
        getCustomersRefetch();
    }, []);

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseSendMessageModal}
        >
            <Modal.Body className="overflow p-4">
                <FormGroup>
                    <div className="multiSelect">
                        <MultiSelect options={options} value={selectedPhones} onChange={(e) => { setSelectedPhones(e); handleChange(e) }} />
                    </div>
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Message</Label>
                    <Input id="exampleText" rows="8" type="textarea" value={message} onChange={(e) => setMessage(e.target.value)} />
                </FormGroup>

                <div className="text-center">
                    <Button
                        className='w-25'
                        onClick={onSendMessage}
                        loading={props?.loading}
                    >Send</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default SendMessageModal;