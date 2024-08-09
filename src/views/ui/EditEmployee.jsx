import React, { useEffect, useState } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAddEmployeeMutation, useEditEmployeeMutation } from '../../services/Api';
import PATHS from '../../routes/Paths';

const EditEmployee = () => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [editEmployee, { isLoading }] = useEditEmployeeMutation();

    const onEditEmployee = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('id', location?.state?.data?.id);

        editEmployee({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.employees);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    useEffect(() => {
        setName(location?.state?.data?.name);
        setPhone(location?.state?.data?.phone);
        setEmail(location?.state?.data?.email);
        setAddress(location?.state?.data?.address);
    }, []);

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
                    placeholder="Phone"
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

            <Button className="mt-2" onClick={onEditEmployee}>Submit</Button>
        </div>
    )
}

export default EditEmployee;