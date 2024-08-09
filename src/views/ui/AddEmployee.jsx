import React, { useState } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useNavigate } from 'react-router-dom';
import { useAddEmployeeMutation } from '../../services/Api';
import PATHS from '../../routes/Paths';

const AddEmployee = () => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const [addEmployee, { isLoading }] = useAddEmployeeMutation();

    const onAddEmployee = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', address);

        addEmployee({ data: formData })
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

            <Button className="mt-2" onClick={onAddEmployee}>Submit</Button>
        </div>
    )
}

export default AddEmployee;