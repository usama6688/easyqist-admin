import React, { useState } from 'react';
import Logo from "../../assets/images/logos/logo.png";
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (email === 'admin@admin.com' && password === '1234') {
            alert('Login successful!');
            localStorage.setItem('loggedin', true);
            navigate(PATHS.starter);
            window.location.reload();
        } else {
            alert('Invalid email or password');
            localStorage.setItem('loggedin', false);
        }
    };

    return (
        <div className='container mt-5'>
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <div className='text-center'>
                        <img src={Logo} alt="" className='img-fluid'/>
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

export default Signup;