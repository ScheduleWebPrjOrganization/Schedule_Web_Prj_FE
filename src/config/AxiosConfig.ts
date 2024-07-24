import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // 쿠키를 허용하여 인증 정보를 전송합니다.
});

export default instance;
