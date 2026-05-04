import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoFlowCompact from '../../components/DemoFlowCompact';
import { homeRecentLearning } from '../../data/mapingoDomainData';
import { useMapingoStore } from '../../store/useMapingoStore';
import { homeService } from '../../api/homeService';
import { learningService } from '../../api/learningService';

function LandingHomePage() {
  const navigate = useNavigate();
  const recentLearning = useMapingoStore((state) => state.recentLearning);
  const currentLevel = useMapingoStore((state) => state.currentLevel);
  const favoriteRouteIds = useMapingoStore((state) => state.favoriteRouteIds);
  const subscriptionPlan = useMapingoStore((state) => state.subscriptionPlan);
  const subscriptionProductId = useMapingoStore((state) => state.subscriptionProductId);
  const subscriptionUpdatedAt = useMapingoStore((state) => state.subscriptionUpdatedAt);
  const weeklyLearnCount = useMapingoStore((state) => state.weeklyLearnCount);
  const weeklyGoalCompleted = useMapingoStore((state) => state.weeklyGoalCompleted);
  const weeklyGoal = useMapingoStore((state) => state.weeklyGoal);
  const learningStreak = useMapingoStore((state) => state.streakDays);
  const storedBadgeProgress = useMapingoStore((state) => state.badgeProgress);
  const badgeProgress = useMemo(
    () =>
      learningService.buildBadgeProgressFromStore({
        recentLearning,
        weeklyLearnCount,
        weeklyGoalCompleted,
        weeklyGoal,
        learningStreak,
        badgeProgress: storedBadgeProgress,
      }),
    [recentLearning, weeklyLearnCount, weeklyGoalCompleted, weeklyGoal, learningStreak, storedBadgeProgress],
  );
  const summary = useMemo(() => learningService.fetchLearningSummary(badgeProgress), [badgeProgress]);
  const recommendations = homeService.fetchHomeRecommendations();

  const recentCards = recentLearning.length > 0 ? recentLearning : homeRecentLearning;
  const subscriptionCopy =
    subscriptionPlan === 'Premium'
      ? subscriptionProductId === 'monthly'
        ? '프리미엄 월간 플랜 이용 중'
        : '프리미엄 연간 플랜 이용 중'
      : '무료 플랜 사용 중';
  const isSubscriptionFresh = Boolean(subscriptionUpdatedAt);

  return (
    <div className="mapingo-home-sections">
      <DemoFlowCompact activePath="/" />
    </div>
  );
}

export default LandingHomePage;
