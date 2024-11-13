import React, { useEffect, useState } from 'react';
import Logo from "../../assets/images/logos/logo.png";
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../../services/Api';
import { loggedIn } from '../../redux/AuthSliceQist';
import { toast } from 'react-toastify';

const SigninUser = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginUser, { isSuccess }] = useLoginUserMutation();

    const handleLogin = () => {

        const data = {
            email: email,
            password: password,
        };

        loginUser({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload?.status) {
                    const response = {
                        token: payload?.access_token,
                        userDetail: payload?.user,
                    };

                    dispatch(loggedIn(response));
                    navigate(PATHS.dashboard);
                    // if (payload?.user?.type == 3) {
                    //     navigate(PATHS.dashboard);
                    // } else {
                    //     navigate(PATHS.dashboard);
                    // }
                    toast.success(payload?.message);
                    // window.location.reload();
                } else {
                    toast.error(payload?.message);
                }
            })
            .catch((error) => {
                toast.error(error?.data?.message);
            });
    };

    // useEffect(() => {
    //     if (isSuccess) {
    //         window.location.reload();
    //     }
    // }, [isSuccess]);

    return (
        <div className='container mt-5'>
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <div className='text-center'>
                        <img src={Logo} alt="" className='w-50' />
                    </div>

                    <div className='mt-5'>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormGroup>
                    </div>

                    <div className='mt-3'>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormGroup>
                    </div>

                    <div className='text-center'>
                        <Button className="mt-2 w-50" onClick={handleLogin}>Submit</Button>
                    </div>
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    )
}

export default SigninUser;