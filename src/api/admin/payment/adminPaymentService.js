import axiosInstance from '../../axiosInstance';

// 전체 결제 목록 조회
async function getAdminPayments() {
    const response = await axiosInstance.get('/api/admin/payments');
    return response.data;
}

// 결제 통계 조회
async function getAdminPaymentStats() {
    const response = await axiosInstance.get('/api/admin/payments/stats');
    return response.data;
}

export const adminPaymentService = {
    getAdminPayments,
    getAdminPaymentStats,
};