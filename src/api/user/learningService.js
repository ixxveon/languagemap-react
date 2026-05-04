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

function fetchLearningSummary(progress = null) {
  if (!progress) {
    return learningSummary;
  }

  return resolveLearningSummary({
    ...defaultBadgeProgress,
    ...progress,
  });
}

function fetchGrowthHighlights() {
  return growthHighlights;
}

function fetchLearningChecklist() {
  return learningChecklist;
}

function fetchLearningActivities() {
  return learningActivities;
}

function fetchBadgeCatalog(progress = null) {
  return resolveBadgeCatalog({
    ...defaultBadgeProgress,
    ...progress,
  });
}

function fetchLearningLevelOptions() {
  return learningLevelOptions;
}

function fetchLearningGoalSuggestions() {
  return learningGoalSuggestions;
}

export const learningService = {
  buildBadgeProgressFromStore,
  fetchLearningSummary,
  fetchGrowthHighlights,
  fetchLearningChecklist,
  fetchLearningActivities,
  fetchBadgeCatalog,
  fetchLearningLevelOptions,
  fetchLearningGoalSuggestions,
};

