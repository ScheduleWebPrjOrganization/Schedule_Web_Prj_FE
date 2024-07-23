// RegisterPage.tsx
import React from 'react';
import Register from '../component/Register';
import './css/register-page.css';  // 스타일 파일 임포트

const RegisterPage: React.FC = () => {
    return (
        <div className="page-container">
            <div className="form-container">
                <Register />
            </div>
        </div>
    );
};

export default RegisterPage;
