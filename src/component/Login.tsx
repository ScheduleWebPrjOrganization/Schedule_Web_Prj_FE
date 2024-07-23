import React, { useState } from 'react';
import axios from '../config/AxiosConfig';
import { useNavigate } from 'react-router-dom';
import { AxiosError, isAxiosError } from 'axios';
import './css/Login.css';

const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/members/login',
                { name, pwd: password },
                { withCredentials:true});
            if (response.status === 200) {
                setMessage("로그인 성공");
                navigate('/dashboard'); // 로그인 성공 시 대시보드로 이동
            }
        } catch (error) {
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data || '로그인 실패';
                setMessage(`인증 실패: ${errorMessage}`);
            } else {
                setMessage('로그인 실패');
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <h2>Login</h2>
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
                <button id="loginBtn" onClick={handleLogin}>Login</button>
                {message && <p>{message}</p>}
                <a id="forgotPassword" href="/forgot-password">Forgot Password?</a>
                <button id="createAccountBtn" onClick={() => navigate('/register')}>Create Account</button>
            </div>
        </div>
    );
};

export default Login;
