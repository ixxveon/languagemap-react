import axiosInstance from '../axiosInstance';

export const socialReportService = {
    async createReport(data) {
        const res = await axiosInstance.post('/api/reports', data);
        return res;
    },

    async getReportHistory(userId) {
        const res = await axiosInstance.get('/api/reports', {
            params: { userId },
        });
        return res;
    },
};
