import React, { useState } from 'react';
import axios from '../config/AxiosConfig';
import { useNavigate } from 'react-router-dom';
import { AxiosError, isAxiosError } from 'axios';
import './css/Register.css';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [verifyingPassword, setVerifyingPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const createdAt = new Date().toISOString();
        try {
            const response = await axios.post('http://localhost:8080/members/register', {
                name,
                pwd: password,
                verifyingPwd: verifyingPassword,
                email,
                createdAt
            });
            setMessage(response.data);
            if (response.data === "회원가입 성공") {
                navigate('/');
            }
        } catch (error) {
            if (isAxiosError(error)) {
                setMessage(typeof error.response?.data === 'string' ? error.response.data : '회원가입 실패');
            } else {
                setMessage('회원가입 실패');
            }
        }
    };

    return (
        <div className="form">
            <h2>Register</h2>
            <input
                type="text"
                className="input"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                className="input"
                placeholder="Verify Password"
                value={verifyingPassword}
                onChange={(e) => setVerifyingPassword(e.target.value)}
            />
            <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button id="registerBtn" onClick={handleRegister}>Register</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
