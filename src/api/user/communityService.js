import axiosInstance from '../axiosInstance';

export const communityService = {
  async fetchFriendComparison(userId) {
    const res = await axiosInstance.get('/api/rankings/friends', {
      params: { userId },
    });
    return res;
  },

  async fetchRankingList() {
    const res = await axiosInstance.get('/api/rankings');
    return res;
  },
};
