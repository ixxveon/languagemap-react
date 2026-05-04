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
} from '../mocks/adminMockData';
import {
  adminCommunityConfigSeeds,
  adminCommunityFriendSeeds,
  adminCommunityGoalSeeds,
  adminCommunityPageList,
  adminCommunityRankingSeeds,
  adminCommunityReportSeeds,
} from '../mocks/adminCommunityMockData';
import {
  coachingModes,
  evaluationResult,
  pronunciationSentences,
  scenarioByMode,
  youtubeRecommendations,
} from '../domains/coaching/data/coachingMockData';
import {
  defaultBadgeProgress,
  resolveBadgeCatalog,
} from '../data/badgeSystem';
import {
  growthHighlights,
  learningActivities,
  learningGoalSuggestions,
  learningLevelOptions,
  learningSummary,
} from '../mocks/learningMockData';
import { supportFaqItems, supportInquiryTemplates } from '../mocks/supportMockData';
import { premiumFeatureAccess, subscriptionProducts } from '../mocks/subscriptionMockData';

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
};
