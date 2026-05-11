import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import CoachingChatSection from '../../components/user/coaching/CoachingChatSection';
import CoachingSummaryCard from '../../components/user/coaching/CoachingSummaryCard';
import CoachingAccessDenied from '../../components/user/coaching/CoachingAccessDenied';
import PronunciationPracticeSection from '../../components/user/coaching/PronunciationPracticeSection';
import YoutubeRecommendationSection from '../../components/user/coaching/YoutubeRecommendationSection';
import { previousLearningSummary } from '../../mocks/user/coachingMockData';
import '../../styles/user/coaching/coachingPage.css';
import '../../styles/user/coaching/coachingChatSection.css';
import '../../styles/user/coaching/pronunciationPractice.css';
import '../../styles/user/coaching/youtubeRecommendation.css';

const coachingModes = [
  { id: 'WORD', label: '더 어려운 단어' },
  { id: 'GRAMMAR', label: '더 어려운 문법' },
  { id: 'DIALOGUE', label: '더 많은 대화' },
];

// 발표/시연용 임시 권한 설정
// 백엔드 AiUsageLimitPolicy와 동일하게 맞춰야 함
const TEST_USER_IDS = [1];
const VIP_USER_IDS = [2];

function CoachingPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('intro');
  const [selectedModeId, setSelectedModeId] = useState('');
  const [finalResult, setFinalResult] = useState(null);
  const isAuthenticated = useMapingoStore((state) => state.isAuthenticated);
  const user = useMapingoStore((state) => state.user);
  const userId = user?.userId;
  const recentMapChatLog = useMapingoStore((state) => state.recentMapChatLog);
  const recentMapLearningSummary = useMapingoStore((state) => state.recentMapLearningSummary);
  const hasAiCoachingAccess = TEST_USER_IDS.includes(userId) || VIP_USER_IDS.includes(userId);

  const learningSummary = useMemo(() => {
    const baseSummary = recentMapLearningSummary
      ? {
          ...previousLearningSummary,
          ...recentMapLearningSummary,
          mapArea: {
            ...previousLearningSummary.mapArea,
            ...recentMapLearningSummary.mapArea,
            conversationLog:
              recentMapLearningSummary.mapArea?.conversationLog ??
              previousLearningSummary.mapArea.conversationLog,
          },
          previousEvaluation: {
            ...previousLearningSummary.previousEvaluation,
            ...recentMapLearningSummary.previousEvaluation,
          },
        }
      : !recentMapChatLog?.length
        ? previousLearningSummary
        : {
            ...previousLearningSummary,
            mapArea: {
              ...previousLearningSummary.mapArea,
              conversationLog: recentMapChatLog.map((message) => ({
                speaker: message.speaker,
                text: message.text,
                role: message.role,
              })),
            },
          };

    return {
      ...baseSummary,
      sessionId:
        baseSummary.sessionId ??
        baseSummary.learningSessionId ??
        (!isAuthenticated ? previousLearningSummary.sessionId : null),
      country: baseSummary.country ?? previousLearningSummary.country,
      city: baseSummary.city ?? previousLearningSummary.city,
      placeAddress: baseSummary.placeAddress ?? baseSummary.mapArea?.address ?? previousLearningSummary.placeAddress,
      evaluation:
        typeof baseSummary.evaluation === 'string'
          ? baseSummary.evaluation
          : baseSummary.previousEvaluation?.content ?? previousLearningSummary.previousEvaluation.content,
    };
  }, [isAuthenticated, recentMapChatLog, recentMapLearningSummary]);

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
          onGoMap={() => navigate('/mapingo')}
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