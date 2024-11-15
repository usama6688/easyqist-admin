import React, { useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";
import { toast } from "react-toastify";
import { useAddAdminMutation } from "../../services/Api";

const AddAdmin = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const [addAdmin] = useAddAdminMutation();

    const onAddAdmin = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('type', role);
        formData.append('is_admin', 1);

        addAdmin({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.admins);
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

    const selectRoleHandler = (value) => {
        setRole(value);
    };

    return (
        <div>
            <Form>
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

                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Password</Label>
                    <Input
                        name="password"
                        placeholder="Name"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Role</Label>
                    <select class="form-select" aria-label="Default select example" onChange={(e) => selectRoleHandler(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="1">Admin</option>
                        <option value="2">Manager</option>
                        <option value="3">Social Media Manager</option>
                        <option value="4">Customer Service User</option>
                        <option value="5">Operation User</option>
                    </select>
                </FormGroup>

                <Button onClick={onAddAdmin} className="mt-2">Submit</Button>
            </Form>
        </div>
    )
}

export default AddAdmin;