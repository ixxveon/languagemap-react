
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

import {
  adminContentList,
  adminMemberList,
  adminMissionSeeds,
  adminNoticeList,
  adminPlaceSearchTypeOptions,
  adminPlaceSeeds,
  adminRegionOptions,
  adminScenarioCategoryOptions,
  adminScenarioLevelOptions,
  adminScenarioSeeds,
} from '../../mocks/admin/adminMockData';
import {
  adminCommunityConfigSeeds,
  adminCommunityFriendSeeds,
  adminCommunityGoalSeeds,
  adminCommunityPageList,
  adminCommunityRankingSeeds,
  adminCommunityReportSeeds,
} from '../../mocks/admin/adminCommunityMockData';
import {
  coachingModes,
  evaluationResult,
  pronunciationSentences,
  scenarioByMode,
  youtubeRecommendations,
} from '../../mocks/user/coaching/coachingMockData';
import {
  defaultBadgeProgress,
  resolveBadgeCatalog,
} from '../../data/user/badgeSystem';
import {
  growthHighlights,
  learningActivities,
  learningGoalSuggestions,
  learningLevelOptions,
  learningSummary,
} from '../../mocks/user/learningMockData';
import { supportFaqItems, supportInquiryTemplates } from '../../mocks/user/supportMockData';
import { premiumFeatureAccess, subscriptionProducts } from '../../mocks/user/subscriptionMockData';

function fetchAdminMembers() {
  return adminMemberList;
}

function fetchAdminNotices() {
  return adminNoticeList;
}

function fetchAdminContent() {
  return adminContentList;
}

function fetchAdminPlaces() {
  return adminPlaceSeeds;
}

function fetchAdminScenarios() {
  return adminScenarioSeeds;
}

function fetchAdminMissions() {
  return adminMissionSeeds;
}

function fetchAdminRegions() {
  return adminRegionOptions;
}

function fetchAdminPlaceSearchTypes() {
  return adminPlaceSearchTypeOptions;
}

function fetchAdminScenarioLevelOptions() {
  return adminScenarioLevelOptions;
}

function fetchAdminScenarioCategoryOptions() {
  return adminScenarioCategoryOptions;
}

function fetchAdminCommunityPages() {
  return adminCommunityPageList;
}

function fetchAdminCommunityConfigs() {
  return adminCommunityConfigSeeds;
}

function fetchAdminCommunityGoals() {
  return adminCommunityGoalSeeds;
}

function fetchAdminCommunityReports() {
  return adminCommunityReportSeeds;
}

function fetchAdminCommunityFriends() {
  return adminCommunityFriendSeeds;
}

function fetchAdminCommunityRanking() {
  return adminCommunityRankingSeeds;
}

function fetchAdminCoachingModes() {
  return coachingModes;
}

function fetchAdminCoachingScenarios() {
  return scenarioByMode;
}

function fetchAdminCoachingEvaluation() {
  return evaluationResult;
}

function fetchAdminCoachingPronunciationSentences() {
  return pronunciationSentences;
}

function fetchAdminCoachingRecommendations() {
  return youtubeRecommendations;
}

function fetchAdminGrowthSummary() {
  return learningSummary;
}

function fetchAdminGrowthHighlights() {
  return growthHighlights;
}

function fetchAdminLearningLevelOptions() {
  return learningLevelOptions;
}

function fetchAdminLearningGoalSuggestions() {
  return learningGoalSuggestions;
}

function fetchAdminLearningActivities() {
  return learningActivities;
}

function fetchAdminBadgeCatalog() {
  return resolveBadgeCatalog(defaultBadgeProgress);
}

function fetchAdminSupportFaqs() {
  return supportFaqItems;
}

function fetchAdminSupportInquiryTemplates() {
  return supportInquiryTemplates;
}

function fetchAdminSubscriptionProducts() {
  return subscriptionProducts;
}

function fetchAdminPremiumFeatureAccess() {
  return premiumFeatureAccess;
}

// 학습 목표 목록 조회
async function getGoals() {
  const res = await api.get('/api/admin/learning/goals');
  return res.data.data;
}

// 학습 목표 생성
async function createGoal(data) {
  const res = await api.post('/api/admin/learning/goals', data);
  return res.data.data;
}

// 학습 목표 수정
async function updateGoal(goalMasterId, data) {
  const res = await api.patch(`/api/admin/learning/goals/${goalMasterId}/active`, data);
  return res.data.data;
}

// 학습 목표 활성 상태 변경
async function updateGoalActive(goalMasterId, isActive) {
  const res = await api.patch(`/api/admin/learning/goals/${goalMasterId}/active`, {
    isActive
  });
  return res.data.data;
}

// 학습 목표 삭제
async function daleteGoal(goalMasterId) {
  await api.delete(`/api/admin/learning/goals/${goalMasterId}`);
}

// 전체 학습 기록 조회
async function getLearningLogs() {
  const res = await api.get('/api/admin/learning/logs');
  return res.data.data;
}

// 사용자별 학습 기록 조회
async function getUserLearningLogs(userId) {
  const res = await api.get(`/api/admin/learning/logs/users/${userId}`);
  return res.data.data;
}


export const adminService = {
  fetchAdminMembers,
  fetchAdminNotices,
  fetchAdminContent,
  fetchAdminPlaces,
  fetchAdminScenarios,
  fetchAdminMissions,
  fetchAdminRegions,
  fetchAdminPlaceSearchTypes,
  fetchAdminScenarioLevelOptions,
  fetchAdminScenarioCategoryOptions,
  fetchAdminCommunityPages,
  fetchAdminCommunityConfigs,
  fetchAdminCommunityGoals,
  fetchAdminCommunityReports,
  fetchAdminCommunityFriends,
  fetchAdminCommunityRanking,
  fetchAdminCoachingModes,
  fetchAdminCoachingScenarios,
  fetchAdminCoachingEvaluation,
  fetchAdminCoachingPronunciationSentences,
  fetchAdminCoachingRecommendations,
  fetchAdminGrowthSummary,
  fetchAdminGrowthHighlights,
  fetchAdminLearningLevelOptions,
  fetchAdminLearningGoalSuggestions,
  fetchAdminLearningActivities,
  fetchAdminBadgeCatalog,
  fetchAdminSupportFaqs,
  fetchAdminSupportInquiryTemplates,
  fetchAdminSubscriptionProducts,
  fetchAdminPremiumFeatureAccess,
  getGoals,
  createGoal,
  updateGoal,
  updateGoalActive,
  deleteGoal,
  getLearningLogs,
  getUserLearningLogs,
};
