import axiosInstance from "../../axiosInstance";

export const adminLearningService = {
  async getGoals() {
    const res = await axiosInstance.get('/api/admin/learning/goals');
    return res.data;
  },

  async createGoal(data) {
    const res = await axiosInstance.post('/api/admin/learning/goals', data);
    return res.data;
  },

  async updateGoal(goalMasterId, data) {
    const res = await axiosInstance.patch(`/api/admin/learning/goals/${goalMasterId}`, data);
    return res.data;
  },

  async updateGoalActive(goalMasterId, active) {
    const res = await axiosInstance.patch(
      `/api/admin/learning/goals/${goalMasterId}/active`,
      { active }
    );
    return res.data;
  },

  async deleteGoal(goalMasterId) {
    const res = await axiosInstance.delete(`/api/admin/learning/goals/${goalMasterId}`);
    return res.data;
  },
};