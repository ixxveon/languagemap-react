import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import { useCoachingEntryQuery } from '../../queries/user/coachingQueries';
import { paymentService } from '../../api/user/paymentService';
import CoachingChatSection from '../../components/user/coaching/CoachingChatSection';
import CoachingSummaryCard from '../../components/user/coaching/CoachingSummaryCard';
import CoachingAccessDenied from '../../components/user/coaching/CoachingAccessDenied';
import CoachingPageState from '../../components/user/coaching/CoachingPageState';
import PronunciationPracticeSection from '../../components/user/coaching/PronunciationPracticeSection';
import YoutubeRecommendationSection from '../../components/user/coaching/YoutubeRecommendationSection';
import '../../styles/user/coaching/coachingPage.css';
import '../../styles/user/coaching/coachingChatSection.css';
import '../../styles/user/coaching/pronunciationPractice.css';
import '../../styles/user/coaching/youtubeRecommendation.css';

const coachingModes = [
  { id: 'WORD', label: '더 어려운 단어' },
  { id: 'GRAMMAR', label: '더 어려운 문법' },
  { id: 'DIALOGUE', label: '더 많은 대화' },
];

const LAST_COACHING_SESSION_STORAGE_KEY = 'lastCoachingLearningSessionId';

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

function CoachingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [phase, setPhase] = useState('intro');
  const [selectedModeId, setSelectedModeId] = useState('');
  const [finalResult, setFinalResult] = useState(null);

  const session = useMapingoStore((state) => state.session);
  const recentMapLearningSummary = useMapingoStore((state) => state.recentMapLearningSummary);
  const recentMapChatLog = useMapingoStore((state) => state.recentMapChatLog);
  const subscriptionPlan = useMapingoStore((state) => state.subscriptionPlan);

  const isSessionReady = Boolean(session?.user);

  const {
    data: subscriptionData,
    isLoading: isSubscriptionLoading,
  } = useQuery({
    queryKey: ['subscription', session?.user?.userId],
    queryFn: async () => {
      try {
        return await paymentService.getSubscription();
      } catch {
        return null;
      }
    },
    enabled: isSessionReady,
    retry: false,
  });

  const storeSubscriptionPlan = String(
    session?.user?.subscriptionPlan ?? subscriptionPlan ?? 'Free'
  ).toLowerCase();

  const hasAiCoachingAccess =
    subscriptionData?.planStatus === 'ACTIVE' ||
    storeSubscriptionPlan === 'premium';

  const sessionId = useMemo(() => {
    const foundSessionId =
      toNumberOrNull(searchParams.get('sessionId')) ??
      toNumberOrNull(location.state?.sessionId) ??
      toNumberOrNull(location.state?.learningSessionId) ??
      toNumberOrNull(location.state?.session?.sessionId) ??
      toNumberOrNull(recentMapLearningSummary?.sessionId) ??
      toNumberOrNull(recentMapLearningSummary?.learningSessionId) ??
      toNumberOrNull(recentMapLearningSummary?.id) ??
      toNumberOrNull(recentMapLearningSummary?.session?.sessionId) ??
      toNumberOrNull(recentMapLearningSummary?.data?.sessionId) ??
      toNumberOrNull(Array.isArray(recentMapChatLog) ? recentMapChatLog[0]?.sessionId : null) ??
      toNumberOrNull(localStorage.getItem(LAST_COACHING_SESSION_STORAGE_KEY)) ??
      null;

    if (foundSessionId) {
      localStorage.setItem(LAST_COACHING_SESSION_STORAGE_KEY, String(foundSessionId));
    }

    return foundSessionId;
  }, [location.state, recentMapChatLog, recentMapLearningSummary, searchParams]);

  const {
    data: coachingEntry,
    isLoading,
    isError,
  } = useCoachingEntryQuery(sessionId, {
    enabled: Boolean(sessionId) && hasAiCoachingAccess,
  });

  const learningSummary = useMemo(() => {
    if (!coachingEntry) return null;

    const sessionMessages = coachingEntry.sessionMessages ?? [];
    const userName =
      session?.user?.name ??
      session?.user?.nickname ??
      session?.user?.email ??
      'You';

    return {
      sessionId: coachingEntry.sessionId,
      learningSessionId: coachingEntry.sessionId,
      placeId: coachingEntry.placeId,
      placeName: coachingEntry.placeName,
      country: coachingEntry.country,
      city: coachingEntry.city,
      placeAddress: coachingEntry.placeAddress,
      evaluation: coachingEntry.evaluation,
      sessionMessages,

      mapArea: {
        title: coachingEntry.placeName ?? '학습 장소',
        subtitle: '현재 학습 장소',
        address: [coachingEntry.city, coachingEntry.placeAddress].filter(Boolean).join(' · '),
        lat: coachingEntry.latitude ?? 37.5665,
        lng: coachingEntry.longitude ?? 126.978,
        zoom: 16,
        conversationLog: sessionMessages.map((message) => ({
          speaker: message.role === 'ASSISTANT' ? 'AI Coach' : userName,
          text: message.message,
          role: message.role,
        })),
      },

      previousEvaluation: {
        title: '이전 평가 내용',
        content: coachingEntry.evaluation || '이전 평가 내용이 없습니다.',
      },
    };
  }, [coachingEntry, session]);

  const handleRetry = () => {
    setSelectedModeId('');
    setFinalResult(null);
    setPhase('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isSessionReady || isSubscriptionLoading) {
    return (
      <div className="coaching-page">
        <CoachingPageState
          title="로그인 정보를 확인하는 중입니다"
          description="AI Coaching 이용 권한을 확인하고 있습니다."
        />
      </div>
    );
  }

  if (!hasAiCoachingAccess) {
    return (
      <div className="coaching-page">
        <CoachingAccessDenied
          onGoMap={() => navigate('/map')}
          onGoPremium={() => navigate('/premium/plans')}
        />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="coaching-page">
        <CoachingPageState
          title="지도 학습 기록이 필요합니다"
          description="AI Coaching은 지도 학습 완료 후 시작할 수 있습니다. 먼저 지도 학습을 완료해주세요."
          actionLabel="지도 학습으로 이동"
          onAction={() => navigate('/map')}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="coaching-page">
        <CoachingPageState
          title="AI Coaching 정보를 불러오는 중입니다"
          description="지도 학습 기록을 기준으로 코칭 정보를 준비하고 있습니다."
        />
      </div>
    );
  }

  if (isError || !learningSummary) {
    return (
      <div className="coaching-page">
        <CoachingPageState
          title="AI Coaching 정보를 불러올 수 없습니다"
          description="지도 학습 기록을 다시 확인해주세요."
          actionLabel="지도 학습으로 이동"
          onAction={() => navigate('/map')}
        />
      </div>
    );
  }

  return (
    <div className="coaching-page">
      <CoachingSummaryCard summary={learningSummary} />

      <div className="coaching-main-flow">
        <CoachingChatSection
          summary={learningSummary}
          modes={coachingModes}
          phase={phase}
          selectedModeId={selectedModeId}
          onSelectMode={setSelectedModeId}
          onPhaseChange={setPhase}
          onEvaluationReady={(result) => {
            setFinalResult(result);
            setPhase('completed');
          }}
          onRetry={handleRetry}
        />

        {phase === 'completed' && finalResult && (
          <div className="coaching-after-flow">
            <PronunciationPracticeSection result={finalResult} />
            <YoutubeRecommendationSection contents={finalResult.contents?.contents ?? []} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CoachingPage;