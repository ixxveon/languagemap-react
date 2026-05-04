import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { routeCatalog } from '../../mocks/user/placeMockData';

const initialPosts = [
  {
    id: 1,
    title: '\uce74\ud398 \uc8fc\ubb38 \ub8e8\ud2b8 \ud6c4\uae30',
    body: '\uc9dd\uc740 \ubb38\uc7a5\ub9cc \uc678\uc6cc\ub3c4 \uc8fc\ubb38 \ud750\ub984\uc774 \uc815\ub9d0 \ud3b8\ud574\uc84c\uc5b4\uc694.',
    tag: '\ud6c4\uae30',
    likes: 12,
  },
  {
    id: 2,
    title: '\uc9c0\ud558\ucca0\uc5d0\uc11c \uc815\ub9d0 \uc4f4 \ud45c\ud604',
    body: '\u201cWhich line should I take?\u201d \ud55c \ubb38\uc7a5\uc774 \uac00\uc7a5 \uc790\uc8fc \uc4f0\uc600\uc5b4\uc694.',
    tag: '\ubb38\uc7a5',
    likes: 19,
  },
  {
    id: 3,
    title: '\uc2a4\ubab0\ud1a0\ud06c \ucc4c\ub9b0\uc9c0 \ucc38\uc5ec',
    body: '\ub0a0\uc528\ub098 \uae30\ubd84 \uc774\uc57c\uae30\ub85c \uc2dc\uc791\ud558\ub2c8 \ubd80\ub2f4\uc774 \ub35c\ud588\uc2b5\ub2c8\ub2e4.',
    tag: '\ucc4c\ub9b0\uc9c0',
    likes: 7,
  },
];

const defaultCommunityForm = {
  title: '',
  body: '',
  tag: '\ud6c4\uae30',
};

const defaultSupportInquiryForm = {
  category: '로그인/회원가입 문의',
  title: '',
  body: '',
};

const initialSupportInquiries = [
  {
    id: 1,
    category: '로그인/회원가입 문의',
    title: '로그인 후 홈 이동 여부',
    body: '로그인 완료 후 홈으로 이동하는 플로우를 확인하고 싶어요.',
    status: '답변 완료',
  },
  {
    id: 2,
    category: '학습 기록 문의',
    title: '최근 학습 카드가 비어 보여요',
    body: '최근 학습 카드가 없을 때 기본 데이터가 보이는지 궁금해요.',
    status: '접수됨',
  },
];

const initialRecentLearning = [
  {
    id: 1,
    title: '\uce74\ud398 \uc8fc\ubb38 \ud45c\ud604',
    meta: '\uc11c\uc6b8 \uc131\uc218 · \uc624\ub298 \uc624\uc804 8:40',
    description: '\uc8fc\ubb38 \ubcc0\uacbd, \uc0ac\uc774\uc988 \ud655\uc778, \ud3ec\uc7a5 \uc5ec\ubd80\ub97c \uc790\uc5f0\uc2a4\ub7fd\uac8c \ub9d0\ud558\ub294 \ub8e8\ud2b8\ub97c \ub9c8\ucce4\uc5b4\uc694.',
    cta: '\uc774\uc5b4 \ud559\uc2b5\ud558\uae30',
  },
  {
    id: 2,
    title: '\uacf5\ud56d \uc785\uad6d \uc2ec\uc0ac',
    meta: '\uc778\ucc9c\uacf5\ud56d · \uc5b4\uc81c \uc624\ud6c4 7:20',
    description: '\uc9c8\ubb38 \uc758\ub3c4 \ud30c\uc545\uacfc \uc9e7\uace0 \uc815\ud655\ud55c \ub2f5\ubcc0 \uc5f0\uc2b5\uc774 \uc911\uc2ec\uc778 \uc2dc\ub098\ub9ac\uc624\uc600\uc5b4\uc694.',
    cta: '\ubcf5\uc2b5\ud558\uae30',
  },
];

const initialSession = {
  user: null,
  loginMethod: null,
  keepSignedIn: false,
};

function resolveSessionRole(session) {
  const email = String(session?.user?.email ?? '')
    .trim()
    .toLowerCase();
  const explicitRole = session?.user?.role;

  if (explicitRole === 'admin') {
    return 'admin';
  }

  return ['admin@mapingo.ai', 'manager@mapingo.ai'].includes(email) ? 'admin' : 'user';
}

const initialFavorites = ['seoul-cityhall-cafe', 'paris-louvre-ticket'];
const defaultBadgeProgress = {
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
  pronunciationImprovement: 20,
  returnedAfterBreak: true,
};

export const useMapingoStore = create(
  persist(
    (set) => ({
      session: initialSession,
      isAuthenticated: false,
      profileName: 'Mapingo Learner',
      profileNickname: 'Route Runner',
      currentLevel: '\uc911\uae09 \uc9c4\uc785',
      currentLevelId: 'intermediate',
      weeklyLearnCount: 12,
      pronunciationScore: 89,
      fluencyScore: 84,
      streakDays: 7,
      badgeCount: 5,
      weeklyGoalCompleted: 4,
      subscriptionPlan: 'Free',
      subscriptionProductId: 'yearly',
      subscriptionUpdatedAt: 0,
      recentLearning: initialRecentLearning,
      mapQuery: '',
      mapActiveTab: 'all',
      mapDifficultyOnly: false,
      selectedRouteId: routeCatalog[0].id,
      recentMapChatLog: [],
      favoriteRouteIds: initialFavorites,
      communityActiveTab: 'all',
      communitySortBy: 'popular',
      communityForm: defaultCommunityForm,
      communityPosts: initialPosts,
      supportInquiryForm: defaultSupportInquiryForm,
      supportInquiries: initialSupportInquiries,
      notificationsEnabled: true,
      showEnglishFirst: false,
      weeklyGoal: '5',
      studyTime: '20:00',
      language: 'en',
      theme: 'light',
      notification: 'all',
      badgeProgress: defaultBadgeProgress,

      setSession: (session) =>
        set(() => {
          const resolvedRole = resolveSessionRole(session);
          const normalizedSession = session?.user
            ? {
                ...session,
                user: {
                  ...session.user,
                  role: resolvedRole,
                },
              }
            : initialSession;

          return {
            session: normalizedSession,
            isAuthenticated: Boolean(normalizedSession?.user),
            profileName: normalizedSession?.user?.name ?? 'Mapingo Learner',
            profileNickname: normalizedSession?.user?.nickname ?? 'Route Runner',
            subscriptionPlan: normalizedSession?.user?.subscriptionPlan ?? 'Free',
            subscriptionProductId: normalizedSession?.user?.subscriptionProductId ?? 'yearly',
            subscriptionUpdatedAt: normalizedSession?.user?.subscriptionUpdatedAt ?? 0,
          };
        }),
      clearSession: () =>
        set(() => ({
          session: initialSession,
          isAuthenticated: false,
          profileName: 'Mapingo Learner',
          profileNickname: 'Route Runner',
          subscriptionPlan: 'Free',
          subscriptionProductId: 'yearly',
          subscriptionUpdatedAt: 0,
        })),
      setIsLoggedIn: (isLoggedIn) =>
        set((state) => ({
          isAuthenticated: isLoggedIn,
          session: isLoggedIn
            ? state.session
            : initialSession,
        })),
      setProfileName: (profileName) => set({ profileName }),
      setProfileNickname: (profileNickname) => set({ profileNickname }),
      setCurrentLevel: ({ id, label }) => set({ currentLevelId: id, currentLevel: label }),
      setWeeklyGoalCompleted: (weeklyGoalCompleted) => set({ weeklyGoalCompleted }),
      setBadgeCount: (badgeCount) => set({ badgeCount }),
      setSubscriptionPlan: (subscriptionPlan) => set({ subscriptionPlan }),
      setSubscriptionProductId: (subscriptionProductId) => set({ subscriptionProductId }),
      markSubscriptionUpdated: () => set({ subscriptionUpdatedAt: Date.now() }),
      setRecentLearning: (recentLearning) => set({ recentLearning }),
      setMapQuery: (mapQuery) => set({ mapQuery }),
      setMapActiveTab: (mapActiveTab) => set({ mapActiveTab }),
      setMapDifficultyOnly: (mapDifficultyOnly) => set({ mapDifficultyOnly }),
      setSelectedRouteId: (selectedRouteId) => set({ selectedRouteId }),
      setRecentMapChatLog: (recentMapChatLog) => set({ recentMapChatLog }),
      toggleFavoriteRoute: (routeId) =>
        set((state) => ({
          favoriteRouteIds: state.favoriteRouteIds.includes(routeId)
            ? state.favoriteRouteIds.filter((id) => id !== routeId)
            : [...state.favoriteRouteIds, routeId],
        })),

      setCommunityActiveTab: (communityActiveTab) => set({ communityActiveTab }),
      setCommunitySortBy: (communitySortBy) => set({ communitySortBy }),
      setCommunityForm: (communityForm) => set({ communityForm }),
      resetCommunityForm: () => set({ communityForm: defaultCommunityForm }),
      addCommunityPost: ({ title, body, tag }) =>
        set((state) => ({
          communityPosts: [
            {
              id: state.communityPosts.length + 1,
              title,
              body,
              tag,
              likes: 0,
            },
            ...state.communityPosts,
          ],
        })),
      likeCommunityPost: (id) =>
        set((state) => ({
          communityPosts: state.communityPosts.map((post) =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post,
          ),
        })),
      setSupportInquiryForm: (supportInquiryForm) => set({ supportInquiryForm }),
      resetSupportInquiryForm: () => set({ supportInquiryForm: defaultSupportInquiryForm }),
      addSupportInquiry: ({ category, title, body }) =>
        set((state) => ({
          supportInquiries: [
            {
              id: state.supportInquiries.length + 1,
              category,
              title,
              body,
              status: '접수됨',
            },
            ...state.supportInquiries,
          ],
        })),

      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setShowEnglishFirst: (showEnglishFirst) => set({ showEnglishFirst }),
      setWeeklyGoal: (weeklyGoal) => set({ weeklyGoal }),
      setStudyTime: (studyTime) => set({ studyTime }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setNotification: (notification) => set({ notification }),
      setBadgeProgress: (badgeProgress) =>
        set((state) => ({
          badgeProgress: {
            ...state.badgeProgress,
            ...badgeProgress,
          },
        })),
    }),
    {
      name: 'mapingo-ui-store',
    },
  ),
);
