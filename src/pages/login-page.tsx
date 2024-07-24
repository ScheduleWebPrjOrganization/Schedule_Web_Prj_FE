import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../component/Login'; // Login 컴포넌트의 경로를 확인하세요.
import './css/login-page.css'; // 필요한 CSS 파일을 임포트

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="form-container">
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;
