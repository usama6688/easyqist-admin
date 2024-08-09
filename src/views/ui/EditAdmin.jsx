import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useAddAdminMutation, useEditAdminMutation } from '../../services/Api';
import { useLocation, useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";
import { toast } from "react-toastify";

const EditAdmin = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const adminData = location?.state?.data;

    const [editAdmin] = useEditAdminMutation();

    const oneditAdmin = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('type', type);
        formData.append('is_admin', 1);

        editAdmin({ data: formData })
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

    useEffect(() => {
        if (adminData) {
            setName(adminData?.name);
            setEmail(adminData?.email);
            setType(adminData?.type);
        }
    }, [adminData]);

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

                {adminData?.type == 1 &&
                    <FormGroup>
                        <Label for="exampleEmail">Type</Label>
                        <Input
                            name="type"
                            placeholder="Type"
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </FormGroup>
                }

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

                <Button onClick={oneditAdmin} className="mt-2">Submit</Button>
            </Form>
        </div>
    )
}

export default EditAdmin;