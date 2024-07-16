import React, { useState } from 'react'; // React와 useState 훅을 임포트
import axios from '../config/AxiosConfig'; // 설정한 axios 인스턴스를 임포트
import { AxiosError, isAxiosError } from 'axios'; // AxiosError 타입과 isAxiosError 유틸리티 함수를 axios 라이브러리에서 임포트

const Register: React.FC = () => { // Register 컴포넌트 정의
    const [id, setId] = useState(''); // id 상태를 정의하고 초기값을 빈 문자열로 설정
    const [password, setPassword] = useState(''); // password 상태를 정의하고 초기값을 빈 문자열로 설정
    const [verifyingPassword, setVerifyingPassword] = useState(''); // verifyingPassword 상태를 정의하고 초기값을 빈 문자열로 설정
    const [email, setEmail] = useState(''); // email 상태를 정의하고 초기값을 빈 문자열로 설정
    const [message, setMessage] = useState(''); // message 상태를 정의하고 초기값을 빈 문자열로 설정

    const handleRegister = async () => { // 회원가입 처리를 위한 함수 정의
        try {
            const response = await axios.post('http://localhost:8080/members/register', {
                id,
                pwd: password,
                verifyingPwd: verifyingPassword,
                email
            }); // axios를 사용하여 회원가입 요청을 보냄
            setMessage(response.data); // 서버 응답 메시지를 message 상태로 설정
        } catch (error) {
            if (isAxiosError(error)) { // 오류가 AxiosError 타입인지 확인
                setMessage(typeof error.response?.data === 'string' ? error.response.data : '회원가입 실패'); // 서버 오류 응답 메시지를 설정, 없으면 '회원가입 실패' 메시지 설정
            } else {
                setMessage('회원가입 실패'); // 일반 오류 메시지를 설정
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                // ID 입력 필드 정의, 값 변경 시 setId로 상태 업데이트
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Password 입력 필드 정의, 값 변경 시 setPassword로 상태 업데이트
            />
            <input
                type="password"
                placeholder="Verify Password"
                value={verifyingPassword}
                onChange={(e) => setVerifyingPassword(e.target.value)}
                // Verify Password 입력 필드 정의, 값 변경 시 setVerifyingPassword로 상태 업데이트
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Email 입력 필드 정의, 값 변경 시 setEmail로 상태 업데이트
            />
            <button onClick={handleRegister}>Register</button>
            // 회원가입 버튼, 클릭 시 handleRegister 함수 호출
            {message && <p>{message}</p>}
            // message 상태가 존재하면 메시지를 화면에 표시
        </div>
    );
};

export default Register; // Register 컴포넌트를 기본 내보내기로 설정
