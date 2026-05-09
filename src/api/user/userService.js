import axiosInstance from '../axiosInstance';

// 내 정보 조회
async function getMe() {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
}

// 소셜 회원가입 유저 프로필 정보 입력
async function setupProfile({ birthDate, address, phoneNumber }) {
    try {
        const response = await axiosInstance.patch('/api/users/profile', {
            birthDate,
            address,
            phoneNumber,
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 400) {
            const data = error.response?.data?.data;
            if (data && typeof data === 'object') {
                const firstMessage = Object.values(data)[0];
                const newError = new Error(firstMessage);
                newError.status = 400;
                throw newError;
            }
        }
        const message = error.response?.data?.message || '프로필 저장에 실패했습니다.';
        const newError = new Error(message);
        newError.status = error.response?.status;
        throw newError;
    }
}

export const userService = {
    getMe,
    setupProfile
};