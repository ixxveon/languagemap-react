import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const adminRankingService = {
  async getRankings() {
    const res = await api.get('/api/admin/rankings');
    return res.data.data;
  },

  async getWeeklyRankings() {
    const res = await api.get('/api/admin/rankings/weekly');
    return res.data.data;
  },

  async getTotalUserCount() {
    const res = await api.get('/api/admin/rankings/users/count');
    return res.data.data;
  },
};