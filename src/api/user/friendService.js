import axiosInstance from '../axiosInstance';

export const friendService = {
    async sendFriendRequest(data, loginUserId) {
        const res = await axiosInstance.post('/api/friends/requests', data, {
            params: { loginUserId },
        });
        return res;
    },

    async sendFriendRequestByEmail(data, loginUserId) {
        const res = await axiosInstance.post('/api/friends/requests/email', data, {
            params: { loginUserId },
        });
        return res;
    },

    async blockFriend(friendshipId, loginUserId) {
        const res = await axiosInstance.patch(`/api/friends/${friendshipId}/block`, null, {
            params: { loginUserId },
        });
        return res;
    },

    async rejectFriendRequest(friendshipId, loginUserId) {
        const res = await axiosInstance.patch(
            `/api/friends/requests/${friendshipId}/reject`,
            null,
            {
                params: { loginUserId },
            },
        );
        return res;
    },

    async acceptFriendRequest(friendshipId, loginUserId) {
        const res = await axiosInstance.patch(
            `/api/friends/requests/${friendshipId}/accept`,
            null,
            {
                params: { loginUserId },
            },
        );
        return res;
    },

    async getFriends(userId) {
        const res = await axiosInstance.get('/api/friends', {
            params: { userId },
        });
        return res;
    },

    async getSentFriendRequests(userId) {
        const res = await axiosInstance.get('/api/friends/requests/sent', {
            params: { userId },
        });
        return res;
    },

    async getReceivedFriendRequests(userId) {
        const res = await axiosInstance.get('/api/friends/requests/received', {
            params: { userId },
        });
        return res;
    },

    async getRecommendFriends(userId) {
        const res = await axiosInstance.get('/api/friends/recommend', {
            params: { userId },
        });
        return res;
    },

    async getFriendHistory(userId) {
        const res = await axiosInstance.get('/api/friends/history', {
            params: { userId },
        });
        return res;
    },

    async deleteFriend(friendshipId, loginUserId) {
        const res = await axiosInstance.delete(
            `/api/friends/${friendshipId}`,
            {
                params: { loginUserId },
            },
        );

        return res;
    }
};
