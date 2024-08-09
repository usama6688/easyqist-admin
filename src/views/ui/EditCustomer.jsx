import React, { useEffect, useState } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEditCustomerMutation } from '../../services/Api';
import PATHS from '../../routes/Paths';

const EditCustomer = () => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const [editCustomer] = useEditCustomerMutation();

    const onEditCustomer = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('id', location?.state?.data?.id);

        editCustomer({ data: formData })
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

    useEffect(() => {
        setName(location?.state?.data?.custname);
        setPhone(location?.state?.data?.phone);
        setAddress(location?.state?.data?.address);
    }, []);

    console.log("location?.state?.data", location?.state?.data?.phone);

    return (
        <div>
            <FormGroup>
                <Label for="exampleEmail">Name</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Phone</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Address</Label>
                <Input
                    placeholder="Address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </FormGroup>

            <Button className="mt-2" onClick={onEditCustomer}>Submit</Button>
        </div>
    )
}

export default EditCustomer;