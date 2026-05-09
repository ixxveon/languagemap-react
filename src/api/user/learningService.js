import axiosInstance from '../axiosInstance';

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

let cachedUserId = null;

async function getLoginUserId() {
  if (cachedUserId) {
    return cachedUserId;
  }

  const res = await axiosInstance.get('/api/users/me');
  cachedUserId = res.data?.data?.userId ?? res.data?.userId;

  if (!cachedUserId) {
    throw new Error('로그인 사용자 ID를 찾을 수 없습니다.');
  }

  return cachedUserId;
}

function extractApiData(res) {
  return res?.data ?? [];
}

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
    const userId = await getLoginUserId();

    const res = await axiosInstance.get('/api/learning/goals/available', {
      params: { userId },
    });

    return extractApiData(res);
  },

  async getActiveGoals() {
    const userId = await getLoginUserId();

    const res = await axiosInstance.get('/api/learning/goals/active', {
      params: { userId },
    });
    return extractApiData(res);
  },

  async getCompletedGoals() {
    const userId = await getLoginUserId();

    const res = await axiosInstance.get('/api/learning/goals/completed', {
      params: { userId },
    });
    return extractApiData(res);
  },

  async selectGoal(goalMasterId) {
    const userId = await getLoginUserId();

    const res = await axiosInstance.post('/api/learning/goals', {
      userId,
      goalMasterId,
    });
    return res?.data;
  },

  async deleteGoal(userGoalId) {
    const userId = await getLoginUserId();

    const res = await axiosInstance.delete(`/api/learning/goals/${userGoalId}`, {
      params: { userId },
    });
    return res?.data;
  },
};