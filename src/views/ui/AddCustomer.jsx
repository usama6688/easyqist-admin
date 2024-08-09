import React, { useState } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
    Col,
    Row,
} from "reactstrap";
import { useNavigate } from 'react-router-dom';
import { useAddCustomerMutation } from '../../services/Api';
import PATHS from '../../routes/Paths';
import PhoneInput from "react-phone-input-2";

const AddCustomer = () => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const [addCustomer] = useAddCustomerMutation();

    const onAddCustomer = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('phone', '+' + phone);
        formData.append('address', address);

        addCustomer({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.customers);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    return (
        <div>
            <Row>
                <Col sm="6" lg="6">
                    <FormGroup>
                        <Label for="exampleEmail">Name</Label>
                        <Input
                            placeholder="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormGroup>
                </Col>

                <Col sm="6" lg="6">
                    <FormGroup>
                        <Label for="exampleEmail">Phone</Label>
                        <PhoneInput country={'pk'} value={phone} onChange={setPhone} />
                    </FormGroup>
                </Col>

                <Col sm="12" lg="12">
                    <FormGroup>
                        <Label for="exampleEmail">Address</Label>
                        <Input
                            placeholder="Address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Button className="mt-2" onClick={onAddCustomer}>Submit</Button>
        </div>
    )
}

export default AddCustomer;