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

// 내 정보 수정
async function updateMe({ name, birthDate, address, phoneNumber }) {
    const response = await axiosInstance.patch('/api/users/me', {
        name,
        birthDate,
        address,
        phoneNumber: phoneNumber ? phoneNumber.replace(/-/g, '') : null,
    });
    return response.data;
}

// 비밀번호 변경
async function changePassword({ currentPassword, newPassword, newPasswordConfirm }) {
    const response = await axiosInstance.patch('/api/users/me/password', {
        currentPassword,
        newPassword,
        newPasswordConfirm,
    });
    return response.data;
}

// 회원 탈퇴
async function deleteMe() {
    const response = await axiosInstance.delete('/api/users/me');
    return response.data;
}

export const userService = {
    getMe,
    setupProfile,
    updateMe,
    changePassword,
    deleteMe,
};