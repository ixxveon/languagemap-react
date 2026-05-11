import axiosInstance from "../axiosInstance";

export const rankingService = {
    async getRankings() {
        const res = await axiosInstance.get("/api/rankings");
        return res.data;
    },

    async getWeeklyRankings() {
        const res = await axiosInstance.get("/api/rankings/weekly");
        return res.data;
    },

    async getTotalUserCount() {
        const res = await axiosInstance.get("/api/rankings/users/count");
        return res.data;
    },

    async getMyRanking(userId) {
        const res = await axiosInstance.get("/api/rankings/me", {
            params: { userId },
        });
        return res.data;
    },

    async getFriendRankings(userId) {
        const res = await axiosInstance.get("/api/rankings/friends", {
            params: { userId },
        });
        return res.data;
    },

    async getFriendBestScore(userId) {
        const res = await axiosInstance.get("/api/rankings/friends/best-score", {
            params: { userId },
        });
        return res.data;
    },

    async getFriendAverageScore(userId) {
        const res = await axiosInstance.get("/api/rankings/friends/average-score", {
            params: { userId },
        });
        return res.data;
    },
};