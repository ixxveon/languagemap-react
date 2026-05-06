import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const adminLearningService = {
  async getGoals() {
    const res = await api.get('/api/admin/learning/goals');
    return res.data.data;
  },

  async createGoal(data) {
    const res = await api.post('/api/admin/learning/goals', data);
    return res.data.data;
  },

  async updateGoal(goalMasterId, data) {
    const res = await api.patch(`/api/admin/learning/goals/${goalMasterId}`, data);
    return res.data.data;
  },

  async updateGoalActive(goalMasterId, active) {
    const res = await api.patch(
      `/api/admin/learning/goals/${goalMasterId}/active`,
      { active }
    );
    return res.data.data;
  },

  async deleteGoal(goalMasterId) {
    const res = await api.delete(`/api/admin/learning/goals/${goalMasterId}`);
    return res.data.data;
  },
};