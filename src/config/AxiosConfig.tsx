// src/axiosConfig.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080', // Spring Boot 서버 URL
    withCredentials: true, // CORS 설정과 함께 쿠키를 허용
});

export default instance;
