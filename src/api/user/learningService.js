import axios from 'axios';

import {
  buildBadgeProgressFromStore,
  defaultBadgeProgress,
  resolveBadgeCatalog,
  resolveLearningSummary,
} from '../../data/user/badgeSystem';

import {
  growthHighlights,
  learningActivities,
  learningChecklist,
  learningGoalSuggestions,
  learningLevelOptions,
  learningSummary,
} from '../../mocks/user/learningMockData';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

const TEMP_USER_ID = 1;

export const learningService = {
  buildBadgeProgressFromStore,

  fetchLearningSummary(progress = null) {
    if (!progress) {
      return learningSummary;
    }

    return resolveLearningSummary({
      ...defaultBadgeProgress,
      ...progress,
    });
  },

  fetchGrowthHighlights() {
    return growthHighlights;
  },

  fetchLearningChecklist() {
    return learningChecklist;
  },

  fetchLearningActivities() {
    return learningActivities;
  },

  fetchBadgeCatalog(progress = null) {
    return resolveBadgeCatalog({
      ...defaultBadgeProgress,
      ...progress,
    });
  },

  fetchLearningLevelOptions() {
    return learningLevelOptions;
  },

  fetchLearningGoalSuggestions() {
    return learningGoalSuggestions;
  },

  async getAvailableGoals() {
    const res = await api.get('/api/learning/goals/available', {
      params: { userId: TEMP_USER_ID },
    });
    return res.data.data;
  },

  async getActiveGoals() {
    const res = await api.get('/api/learning/goals/active', {
      params: { userId: TEMP_USER_ID },
    });
    return res.data.data;
  },

  async getCompletedGoals() {
    const res = await api.get('/api/learning/goals/completed', {
      params: { userId: TEMP_USER_ID },
    });
    return res.data.data;
  },

  async selectGoal(goalMasterId) {
    const res = await api.post('/api/learning/goals', {
      userId: TEMP_USER_ID,
      goalMasterId,
    });
    return res.data.data;
  },

  async deleteGoal(userGoalId) {
    const res = await api.delete(`/api/learning/goals/${userGoalId}`, {
      params: { userId: TEMP_USER_ID },
    });
    return res.data.data;
  },
};