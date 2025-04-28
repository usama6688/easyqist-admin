import React, { useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
    Row,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";
import { toast } from "react-toastify";
import { useAddVendorMutation } from "../../services/Api";
import PhoneInput from "react-phone-input-2";

const AddVendor = () => {

    const [name, setName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const [addVendor] = useAddVendorMutation();

    const onAddVendor = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('phone_no', phone);
        formData.append('address', address1);
        formData.append('address2', address2);
        formData.append('password', password);

        addVendor({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.allVendors);
                    window.location.reload();
                } else {
                    toast.error(payload.message);
                }
            })
            .catch((error) => {
                console.log("error", error);
                toast.error(error.message);
            });
    };

    return (
        <div>
            <Form>
                <Row>
                    <Col sm="6" lg="6">
                        <FormGroup>
                            <Label for="exampleEmail">Name</Label>
                            <Input
                                name="name"
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
                </Row>

                <FormGroup>
                    <Label for="exampleEmail">Address Line 1</Label>
                    <Input
                        name="address1"
                        placeholder="Address 1"
                        type="text"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Address Line 2</Label>
                    <Input
                        name="address2"
                        placeholder="Address 2"
                        type="text"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Password</Label>
                    <Input
                        name="password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>

                <Button onClick={onAddVendor} className="mt-2">Submit</Button>
            </Form>
        </div >
    )
}

export default AddVendor;