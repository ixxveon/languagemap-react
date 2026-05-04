export const defaultBadgeProgress = {
  totalStudyCount: 18,
  totalStudyMinutes: 145,
  dailyStudyMaxCount: 5,
  weeklyActiveDays: 5,
  pronunciationPracticeCount: 10,
  pronunciationScore80PlusCount: 10,
  pronunciationScore90PlusCount: 3,
  pronunciationScore95PlusCount: 1,
  goalsCreatedCount: 3,
  goalsCompletedCount: 1,
  goalMaintainedDays: 3,
  weeklyGoalAchievedCount: 1,
  overAchievementRate: 120,
  pronunciationImprovement: 20,
  streakDays: 14,
  returnedAfterBreak: true,
};

const badgeDefinitions = [
  {
    id: 'pronunciation-explorer',
    name: '발음 집중 탐험가',
    category: 'pronunciation',
    imageUrl: '/assets/badges/pronunciation-explorer.png',
    description: '발음 학습 10회를 달성하면 받을 수 있는 시작 배지예요.',
    condition: '발음 학습 10회 달성',
    targetValue: 10,
    getCurrentValue: (progress) => progress.pronunciationPracticeCount,
  },
  {
    id: 'classic-pronouncer',
    name: '고득점 발음가',
    category: 'pronunciation',
    imageUrl: '/assets/badges/classic-pronouncer.png',
    description: '발음 점수 90점 이상을 3회 달성하면 받을 수 있어요.',
    condition: '발음 점수 90점 이상 3회 달성',
    targetValue: 3,
    getCurrentValue: (progress) => progress.pronunciationScore90PlusCount,
  },
  {
    id: 'balanced-pronouncer',
    name: '균형 잡힌 발음가',
    category: 'pronunciation',
    imageUrl: '/assets/badges/balanced-pronouncer.png',
    description: '발음 점수 80점 이상을 10회 달성하면 받을 수 있어요.',
    condition: '발음 점수 80점 이상 10회 달성',
    targetValue: 10,
    getCurrentValue: (progress) => progress.pronunciationScore80PlusCount,
  },
  {
    id: 'perfect-voice',
    name: '완벽에 도달한 목소리',
    category: 'pronunciation',
    imageUrl: '/assets/badges/perfect-voice.png',
    description: '발음 점수 95점 이상을 한 번이라도 기록하면 획득해요.',
    condition: '발음 점수 95점 이상 1회 달성',
    targetValue: 1,
    getCurrentValue: (progress) => progress.pronunciationScore95PlusCount,
  },
  {
    id: 'first-goal-setter',
    name: '첫 목표 설정자',
    category: 'goal',
    imageUrl: '/assets/badges/first-goal-setter.png',
    description: '목표를 한 번 이상 설정하면 받을 수 있는 첫 목표 배지예요.',
    condition: '목표 1개 이상 설정',
    targetValue: 1,
    getCurrentValue: (progress) => progress.goalsCreatedCount,
  },
  {
    id: 'goal-completion-explorer',
    name: '목표 달성 탐험가',
    category: 'goal',
    imageUrl: '/assets/badges/goal-completion-explorer.png',
    description: '설정한 목표를 한 번 달성하면 받을 수 있어요.',
    condition: '설정한 목표 1회 달성',
    targetValue: 1,
    getCurrentValue: (progress) => progress.goalsCompletedCount,
  },
  {
    id: 'weekly-goal-finisher',
    name: '주간 목표 완주자',
    category: 'goal',
    imageUrl: '/assets/badges/weekly-goal-finisher.png',
    description: '주간 목표를 끝까지 채우면 받을 수 있어요.',
    condition: '주간 목표 달성',
    targetValue: 1,
    getCurrentValue: (progress) => progress.weeklyGoalAchievedCount,
  },
  {
    id: 'goal-keeper',
    name: '길을 잃지 않은 여행자',
    category: 'goal',
    imageUrl: '/assets/badges/goal-keeper.png',
    description: '목표를 3일 이상 유지하면 받을 수 있어요.',
    condition: '목표를 3일 이상 유지',
    targetValue: 3,
    getCurrentValue: (progress) => progress.goalMaintainedDays,
  },
  {
    id: 'beyond-goal',
    name: '한계를 넘은 탐험가',
    category: 'goal',
    imageUrl: '/assets/badges/beyond-goal.png',
    description: '목표 대비 120%를 달성하면 받을 수 있어요.',
    condition: '목표 대비 120% 달성',
    targetValue: 120,
    getCurrentValue: (progress) => progress.overAchievementRate,
  },
  {
    id: 'goal-strategist',
    name: '여정을 설계한 전략가',
    category: 'goal',
    imageUrl: '/assets/badges/goal-strategist.png',
    description: '목표를 3개 이상 설정하고 달성까지 이어가면 받을 수 있어요.',
    condition: '목표 3개 이상 설정 후 달성',
    targetValue: 3,
    getCurrentValue: (progress) =>
      progress.goalsCompletedCount > 0 ? progress.goalsCreatedCount : 0,
  },
  {
    id: 'growth-prover',
    name: '성장을 증명한 탐험가',
    category: 'growth',
    imageUrl: '/assets/badges/growth-prover.png',
    description: '처음보다 20점 이상 성장하면 받을 수 있어요.',
    condition: '처음보다 +20점 상승',
    targetValue: 20,
    getCurrentValue: (progress) => progress.pronunciationImprovement,
  },
  {
    id: 'challenge-breaker',
    name: '한계를 넘은 탐험가',
    category: 'growth',
    imageUrl: '/assets/badges/beyond-goal.png',
    description: '목표 대비 120% 이상 달성한 도전을 증명하는 배지예요.',
    condition: '목표 대비 120% 달성',
    targetValue: 120,
    getCurrentValue: (progress) => progress.overAchievementRate,
  },
  {
    id: 'first-trip',
    name: '첫걸음 여행자',
    category: 'learning',
    imageUrl: '/assets/badges/first-trip.png',
    description: '학습을 한 번 완료하면 받는 첫 학습 배지예요.',
    condition: '학습 1회 완료',
    targetValue: 1,
    getCurrentValue: (progress) => progress.totalStudyCount,
  },
  {
    id: 'steady-explorer',
    name: '꾸준한 탐험가',
    category: 'learning',
    imageUrl: '/assets/badges/steady-explorer.png',
    description: '학습 10회를 완료하면 받을 수 있어요.',
    condition: '학습 10회 완료',
    targetValue: 10,
    getCurrentValue: (progress) => progress.totalStudyCount,
  },
  {
    id: 'study-master',
    name: '학습 마스터',
    category: 'learning',
    imageUrl: '/assets/badges/study-master.png',
    description: '학습 50회를 완료하면 획득하는 상위 학습 배지예요.',
    condition: '학습 50회 완료',
    targetValue: 50,
    getCurrentValue: (progress) => progress.totalStudyCount,
  },
  {
    id: 'focus-sailor',
    name: '하루 집중 항해사',
    category: 'learning',
    imageUrl: '/assets/badges/focus-sailor.png',
    description: '하루에 학습 5회를 완료하면 받을 수 있어요.',
    condition: '하루에 학습 5회 완료',
    targetValue: 5,
    getCurrentValue: (progress) => progress.dailyStudyMaxCount,
  },
  {
    id: 'time-builder',
    name: '시간을 쌓은 탐험가',
    category: 'learning',
    imageUrl: '/assets/badges/time-builder.png',
    description: '총 학습 시간 2시간 이상이 되면 획득해요.',
    condition: '총 학습 시간 2시간 이상',
    targetValue: 120,
    getCurrentValue: (progress) => progress.totalStudyMinutes,
  },
  {
    id: 'rhythm-maker',
    name: '리듬을 만든 여행자',
    category: 'learning',
    imageUrl: '/assets/badges/rhythm-maker.png',
    description: '7일 중 5일 이상 학습하면 받을 수 있어요.',
    condition: '7일 중 5일 이상 학습',
    targetValue: 5,
    getCurrentValue: (progress) => progress.weeklyActiveDays,
  },
  {
    id: 'streak-3',
    name: '3일 연속 여행자',
    category: 'streak',
    imageUrl: '/assets/badges/streak-3.png',
    description: '3일 연속 학습하면 받을 수 있어요.',
    condition: '3일 연속 학습',
    targetValue: 3,
    getCurrentValue: (progress) => progress.streakDays,
  },
  {
    id: 'streak-7',
    name: '7일 연속 항해자',
    category: 'streak',
    imageUrl: '/assets/badges/streak-7.png',
    description: '7일 연속 학습 루틴을 만들면 획득해요.',
    condition: '7일 연속 학습',
    targetValue: 7,
    getCurrentValue: (progress) => progress.streakDays,
  },
  {
    id: 'streak-14',
    name: '호흡을 이어간 탐험가',
    category: 'streak',
    imageUrl: '/assets/badges/streak-14.png',
    description: '14일 연속 학습을 이어가면 받을 수 있어요.',
    condition: '14일 연속 학습',
    targetValue: 14,
    getCurrentValue: (progress) => progress.streakDays,
  },
  {
    id: 'streak-30',
    name: '끊임없는 항해자',
    category: 'streak',
    imageUrl: '/assets/badges/streak-30.png',
    description: '30일 연속 학습을 달성하면 받는 최상위 배지예요.',
    condition: '30일 연속 학습',
    targetValue: 30,
    getCurrentValue: (progress) => progress.streakDays,
  },
  {
    id: 'return-traveler',
    name: '다시 길을 찾은 여행자',
    category: 'streak',
    imageUrl: '/assets/badges/return-traveler.png',
    description: '3일 이상 쉬고 다시 학습을 시작하면 받을 수 있어요.',
    condition: '3일 이상 쉬고 다시 학습',
    targetValue: 1,
    getCurrentValue: (progress) => (progress.returnedAfterBreak ? 1 : 0),
  },
];

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildBadgeProgressFromStore(state) {
  const weeklyGoal = Number(state.weeklyGoal || 0);
  const totalStudyCount =
    state.badgeProgress?.totalStudyCount ??
    state.recentLearning.length + state.weeklyLearnCount + state.weeklyGoalCompleted;
  const totalStudyMinutes =
    state.badgeProgress?.totalStudyMinutes ??
    state.recentLearning.reduce((sum, item) => {
      const matched = String(item.meta || '').match(/(\d+)/);
      return sum + Number(matched?.[1] || 15);
    }, 0);

  return {
    ...defaultBadgeProgress,
    ...(state.badgeProgress || {}),
    totalStudyCount,
    totalStudyMinutes,
    dailyStudyMaxCount: state.badgeProgress?.dailyStudyMaxCount ?? Math.max(1, state.weeklyLearnCount),
    weeklyActiveDays: state.badgeProgress?.weeklyActiveDays ?? Math.max(1, Math.min(7, state.weeklyLearnCount)),
    goalsCreatedCount: state.badgeProgress?.goalsCreatedCount ?? Math.max(1, weeklyGoal > 0 ? 3 : 1),
    goalsCompletedCount: state.badgeProgress?.goalsCompletedCount ?? Math.max(1, state.weeklyGoalCompleted),
    goalMaintainedDays: state.badgeProgress?.goalMaintainedDays ?? Math.max(3, state.weeklyLearnCount),
    weeklyGoalAchievedCount:
      state.badgeProgress?.weeklyGoalAchievedCount ?? (state.weeklyGoalCompleted >= weeklyGoal && weeklyGoal > 0 ? 1 : 0),
    overAchievementRate:
      state.badgeProgress?.overAchievementRate ??
      (weeklyGoal > 0 ? Math.round((state.weeklyGoalCompleted / weeklyGoal) * 100) : 120),
    streakDays:
      state.badgeProgress?.streakDays ??
      Math.max(state.learningStreak || 0, state.weeklyLearnCount || 0, defaultBadgeProgress.streakDays),
  };
}

function resolveStatus(currentValue, targetValue) {
  if (currentValue >= targetValue) {
    return 'earned';
  }

  if (currentValue > 0) {
    return 'progress';
  }

  return 'locked';
}

export function resolveBadgeCatalog(progress) {
  return badgeDefinitions.map((badge) => {
    const currentValue = Number(badge.getCurrentValue(progress) || 0);
    const progressPercent = clampPercent((currentValue / badge.targetValue) * 100);
    const status = resolveStatus(currentValue, badge.targetValue);

    return {
      ...badge,
      currentValue,
      progressPercent,
      status,
      earnedAt: status === 'earned' ? '2026.04.22' : null,
    };
  });
}

export function resolveLearningSummary(progress) {
  const badgeCatalog = resolveBadgeCatalog(progress);
  const earnedBadges = badgeCatalog.filter((badge) => badge.status === 'earned');

  return {
    levelLabel: `Lv. ${progress.totalStudyCount >= 50 ? 60 : progress.totalStudyCount >= 20 ? 40 : 10}`,
    totalExperience: `${progress.totalStudyCount * 20 + progress.pronunciationImprovement} EXP`,
    completedSessions: `${progress.totalStudyCount}회`,
    earnedBadgeCount: `${earnedBadges.length}개`,
    earnedBadges,
  };
}
