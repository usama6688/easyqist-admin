import React, { useState } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useNavigate } from 'react-router-dom';
import ImageViewer from '../../components/ImageViewer';
import uploadIcon from "../../assets/images/uploadImg.svg";
import { useNewUserMutation } from '../../services/Api';
import PATHS from '../../routes/Paths';
import PhoneInput from 'react-phone-input-2';

const AddUser = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [cnic, setCnic] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [newUser] = useNewUserMutation();

    const onAddUser = () => {

        let data = {
            name: firstName + "" + lastName,
            phone_no: '+' + phone,
            cnic_number: cnic,
        };

        newUser({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.users);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const handlePhoneChange = (value) => {
        if (!value.startsWith('92')) {
            value = '92' + value.replace(/^92*/, '');
        }
        setPhone(value);
    };

    const handleChange = (e) => {
        const value = e.target.value;

        if (!/^\d*$/.test(value)) {
            setError('Please enter only numbers.');
            return;
        }

        setCnic(value);

        if (value.length < 13) {
            setError('Number must be exactly 13 digits.');
        } else if (value.length > 13) {
            setError('Number must be exactly 13 digits.');
        } else {
            setError('');
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-6">
                    <FormGroup>
                        <Label for="exampleEmail">First Name</Label>
                        <Input
                            placeholder="First Name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormGroup>
                </div>

                <div className="col-6">
                    <FormGroup>
                        <Label for="exampleEmail">Last Name</Label>
                        <Input
                            placeholder="Last Name"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </FormGroup>
                </div>

                <div className="col-6">
                    <FormGroup>
                        <Label for="exampleEmail">CNIC</Label>
                        <Input
                            type="text"
                            placeholder="CNIC"
                            className="inputField"
                            value={cnic}
                            onChange={handleChange}
                            maxLength={13}
                        />
                    </FormGroup>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                <div className="col-6">
                    <Label for="exampleEmail">Enter Phone No.</Label>
                    <PhoneInput
                        country={'pk'}
                        value={phone}
                        onChange={handlePhoneChange}
                        onlyCountries={['pk']}
                        disableDropdown={true}
                        placeholder='+92 xxx xxxxxxx'
                    />
                </div>
            </div>

            <Button className="mt-2" onClick={onAddUser}>Submit</Button>
        </div>
    )
}

export default AddUser;