import axiosInstance from '../axiosInstance';

// 내 정보 조회
async function getMe() {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
}

export const userService = {
    getMe,
};