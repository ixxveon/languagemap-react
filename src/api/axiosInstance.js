import axios from 'axios';

const axiosInstance = axios.create({
    // Spring Boot 백엔드 주소
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    // HttpOnly Cookie 자동 전송에 필수
    withCredentials: true,
});

// 요청 인터셉터 - 모든 요청에 accessToken 자동 첨부
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 - 공통 에러 처리
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // 토큰 만료 → 로그아웃 처리
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }

        if (status === 403) {
            alert('접근 권한이 없습니다.');
        }

        if (status === 500) {
            alert('서버 오류가 발생했습니다.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;