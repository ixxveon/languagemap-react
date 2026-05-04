import { friendComparisonList, rankingList } from '../mocks/communityMockData';

function fetchFriendComparison() {
  return friendComparisonList;
}

function fetchRankingList() {
  return rankingList;
}

export const communityService = {
  fetchFriendComparison,
  fetchRankingList,
};
