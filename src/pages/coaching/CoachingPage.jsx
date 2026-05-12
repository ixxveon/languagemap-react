import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import { useCoachingEntryQuery } from '../../queries/user/coachingQueries';
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

// 시연용 임시 권한 설정
const TEST_USER_IDS = [1];

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
  const userId = session?.user?.userId;
  const hasAiCoachingAccess = TEST_USER_IDS.includes(userId);

  const sessionId = useMemo(() => {
    return (
      toNumberOrNull(searchParams.get('sessionId')) ??
      toNumberOrNull(location.state?.sessionId) ??
      toNumberOrNull(location.state?.learningSessionId) ??
      toNumberOrNull(location.state?.session?.sessionId) ??
      toNumberOrNull(recentMapLearningSummary?.sessionId) ??
      toNumberOrNull(recentMapLearningSummary?.learningSessionId) ??
      toNumberOrNull(recentMapLearningSummary?.id) ??
      toNumberOrNull(recentMapLearningSummary?.session?.sessionId) ??
      toNumberOrNull(recentMapLearningSummary?.data?.sessionId) ??
      toNumberOrNull(recentMapChatLog?.[0]?.sessionId) ??
      null
    );
  }, [location.state, recentMapChatLog, recentMapLearningSummary, searchParams]);

  const {
    data: coachingEntry,
    isLoading,
    isError,
    error,
  } = useCoachingEntryQuery(sessionId);

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
          speaker:
            message.role === 'ASSISTANT'
              ? 'AI Coach'
              : userName,
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