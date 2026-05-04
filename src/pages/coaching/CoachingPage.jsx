import { useMemo, useState } from 'react';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import CoachingChatSection from '../../components/user/coaching/CoachingChatSection';
import CoachingSummaryCard from '../../components/user/coaching/CoachingSummaryCard';
import PronunciationPracticeSection from '../../components/user/coaching/PronunciationPracticeSection';
import YoutubeRecommendationSection from '../../components/user/coaching/YoutubeRecommendationSection';
import {
    coachingModes,
    evaluationResult,
    previousLearningSummary,
    pronunciationSentences,
    scenarioByMode,
    voiceConversation,
    youtubeRecommendations,
} from '../../mocks/user/coaching/coachingMockData';
import '../../styles/user/coaching/coachingPage.css';
import '../../styles/user/coaching/coachingChatSection.css';
import '../../styles/user/coaching/pronunciationPractice.css';
import '../../styles/user/coaching/youtubeRecommendation.css';

function CoachingPage() {
    const [phase, setPhase] = useState('intro');
    const [selectedModeId, setSelectedModeId] = useState('');
    const recentMapChatLog = useMapingoStore((state) => state.recentMapChatLog);

    const selectedScenario = useMemo(() => {
        if (!selectedModeId) return null;
        return scenarioByMode[selectedModeId];
    }, [selectedModeId]);

    const learningSummary = useMemo(() => {
        if (!recentMapChatLog?.length) {
            return previousLearningSummary;
        }

        return {
            ...previousLearningSummary,
            mapArea: {
                ...previousLearningSummary.mapArea,
                conversationLog: recentMapChatLog.map((message) => ({
                    speaker: message.speaker,
                    text: message.text,
                })),
            },
        };
    }, [recentMapChatLog]);

    const handleSelectMode = (modeId) => {
        setSelectedModeId(modeId);
        setPhase('scenario');
    };

    const handleRetry = () => {
        setSelectedModeId('');
        setPhase('intro');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="coaching-page">
            <CoachingSummaryCard summary={learningSummary} />

            <div className="coaching-main-flow">
                <CoachingChatSection
                    summary={learningSummary}
                    modes={coachingModes}
                    selectedScenario={selectedScenario}
                    voiceMessages={voiceConversation}
                    evaluation={evaluationResult}
                    phase={phase}
                    onSelectMode={handleSelectMode}
                    onStartPractice={() => setPhase('practice')}
                    onCompletePractice={() => setPhase('completed')}
                    onRetry={handleRetry}
                />

                {phase === 'completed' && (
                    <div className="coaching-after-flow">
                        <PronunciationPracticeSection sentences={pronunciationSentences} />
                        <YoutubeRecommendationSection videos={youtubeRecommendations} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoachingPage;
