import axiosInstance from '../../axiosInstance';


async function getAdminUsers(keyword) {
    const params = keyword ? { keyword } : {};
    const response = await axiosInstance.get('/api/admin/users', { params });
    return response.data;
}

async function getAdminUserDetail(userId) {
    const response = await axiosInstance.get(`/api/admin/users/${userId}`);
    return response.data;
}

async function updateAdminUserStatus(userId, status) {
    const response = await axiosInstance.patch(`/api/admin/users/${userId}/status`, { status });
    return response.data;
}

export const adminUserService = {
    getAdminUsers,
    getAdminUserDetail,
    updateAdminUserStatus,
};