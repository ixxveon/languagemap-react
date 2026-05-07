import axiosInstance from "../../axiosInstance";

export const adminSocialService = {

    async getReports() {
        const res = await axiosInstance.get('/api/admin/social/reports');
        return res.data;
    },

    async getReportDetail(reportId) {
        const res = await axiosInstance.get(`/api/admin/social/reports/${reportId}`);
        return res.data;
    },

    async updateReportStatus(reportId, data) {
        const res = await axiosInstance.patch(
            `/api/admin/social/reports/${reportId}/status`,
            data
        );

        return res.data;
    },

    async getBlockedFriendships() {
        const res = await axiosInstance.get('/api/admin/social/friendships/blocked');
        return res.data;
    },

    async getRejectedFriendships() {
        const res = await axiosInstance.get('/api/admin/social/friendships/rejected');
        return res.data;
    },
}