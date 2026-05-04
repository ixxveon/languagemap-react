import { useEffect, useMemo, useRef, useState } from 'react';
import CoachingModeSelector from './CoachingModeSelector';
import VoiceMessageBubble from './VoiceMessageBubble';
import { scenarioByMode } from '../../../mocks/user/coaching/coachingMockData';

function createTextMessage(role, speaker, text, extra = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random()}`,
    type: 'text',
    role,
    speaker,
    text,
    ...extra,
  };
}

function createVoiceMessage(message) {
  return {
    ...message,
    id: `voice-${message.id}-${Date.now()}-${Math.random()}`,
    type: 'voice',
  };
}

function CoachingChatSection({
  summary,
  modes,
  voiceMessages,
  evaluation,
  phase,
  onSelectMode,
  onStartPractice,
  onCompletePractice,
  onRetry,
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceCursor, setVoiceCursor] = useState(0);
  const [awaitingEvaluation, setAwaitingEvaluation] = useState(false);
  const chatLogRef = useRef(null);

  const modeReplies = useMemo(
    () => modes.map((mode) => ({ id: `mode_${mode.id}`, label: mode.label, modeId: mode.id })),
    [modes],
  );

  const initialMessage = useMemo(
    () =>
      createTextMessage(
        'ai',
        'AI Coach',
        `${summary.userName}님, 방금 시드니의 888 카페에서 주문하고 오셨군요. 이전 체크 포인트는 발음 ${summary.evaluation.pronunciation}, 표현 ${summary.evaluation.expression}, 응답 속도 ${summary.evaluation.responseSpeed}였어요. 이번에는 어떤 방향으로 더 깊게 연습하고 싶으세요?`,
        { quickReplies: modeReplies },
      ),
    [
      modeReplies,
      summary.evaluation.expression,
      summary.evaluation.pronunciation,
      summary.evaluation.responseSpeed,
      summary.userName,
    ],
  );

  useEffect(() => {
    if (phase === 'intro') {
      setMessages([initialMessage]);
      setInput('');
      setIsRecording(false);
      setVoiceCursor(0);
      setAwaitingEvaluation(false);
    }
  }, [initialMessage, phase]);

  useEffect(() => {
    const log = chatLogRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [messages]);

  const appendMessages = (nextMessages) => {
    setMessages((current) => [...current, ...nextMessages]);
  };

  const showEvaluation = (userText = '네, 좋아요. 평가 보여주세요.') => {
    setAwaitingEvaluation(false);
    onCompletePractice();
    appendMessages([
      createTextMessage('user', summary.userName, userText),
      createTextMessage('ai', 'AI Coach', `오늘 연습이 끝났습니다. 종합 점수는 ${evaluation.score}점이에요. ${evaluation.summary}`, {
        evaluation,
        quickReplies: [
          { id: 'retry', label: '다시 연습하기' },
          { id: 'go_map', label: '지도 학습으로 돌아가기' },
        ],
      }),
    ]);
  };

  const handleSelectMode = (modeId) => {
    const mode = modes.find((item) => item.id === modeId);
    const nextScenario = scenarioByMode[modeId];

    onSelectMode(modeId);
    appendMessages([
      createTextMessage('user', summary.userName, `${mode?.label}로 연습할래요.`),
      {
        ...createTextMessage('ai', 'AI Coach', nextScenario.prompt),
        scenarioTitle: nextScenario.title,
        scenarioGoal: nextScenario.goal,
        keySentences: nextScenario.keySentences,
        quickReplies: [{ id: 'start_practice', label: '오케이, 시작하기' }],
      },
    ]);
  };

  const handleStartPractice = () => {
    onStartPractice();
    setVoiceCursor(1);
    appendMessages([
      createTextMessage('user', summary.userName, '오케이, 시작할게요.'),
      createVoiceMessage(voiceMessages[0]),
    ]);
  };

  const appendNextAiVoiceOrClosing = (cursor) => {
    const nextAiIndex = cursor + 1;

    if (voiceMessages[nextAiIndex]) {
      setVoiceCursor(nextAiIndex + 1);
      appendMessages([createVoiceMessage(voiceMessages[nextAiIndex])]);
      return;
    }

    setAwaitingEvaluation(true);
    appendMessages([
      createTextMessage('ai', 'AI Coach', 'Great! 잘하셨어요. 바로 평가 볼까요?', {
        quickReplies: [{ id: 'show_evaluation', label: '평가 보기' }],
      }),
    ]);
  };

  const handleSendMessage = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setInput('');

    if (awaitingEvaluation && /평가|좋아요|네|예|ok|okay/i.test(trimmed)) {
      showEvaluation(trimmed);
      return;
    }

    appendMessages([createTextMessage('user', summary.userName, trimmed)]);

    if (phase === 'practice') {
      setTimeout(() => appendNextAiVoiceOrClosing(voiceCursor), 250);
      return;
    }

    appendMessages([
      createTextMessage('ai', 'AI Coach', '좋아요. 아래 세 가지 중 하나를 골라주면 그 방향으로 바로 이어갈게요.', {
        quickReplies: modeReplies,
      }),
    ]);
  };

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      return;
    }

    setIsRecording(false);

    if (phase !== 'practice') {
      handleSendMessage('음성 로그로 코칭할게요.');
      return;
    }

    const userVoiceIndex = voiceCursor;
    const nextUserVoice = voiceMessages[userVoiceIndex];
    if (!nextUserVoice) return;

    setVoiceCursor(userVoiceIndex + 1);
    appendMessages([createVoiceMessage(nextUserVoice)]);
    setTimeout(() => appendNextAiVoiceOrClosing(userVoiceIndex), 250);
  };

  const handleQuickReply = (reply) => {
    if (reply.modeId) {
      handleSelectMode(reply.modeId);
      return;
    }

    if (reply.id === 'start_practice') {
      handleStartPractice();
      return;
    }

    if (reply.id === 'show_evaluation') {
      showEvaluation('평가 보기');
      return;
    }

    if (reply.id === 'retry') {
      onRetry();
      return;
    }

    if (reply.id === 'go_map') {
      window.location.href = '/map';
    }
  };

  return (
    <section className="coaching-chat-panel" aria-labelledby="coaching-chat-title">
      <header className="coaching-chat-header">
        <div className="coaching-chat-title">
          <span className="coaching-live-dot" aria-hidden="true" />
          <div>
            <p>AI Coach</p>
            <h1 id="coaching-chat-title">심화 코칭 채팅</h1>
          </div>
        </div>
        <span className={`coaching-status-pill is-${phase}`}>
          {phase === 'intro' && '대기 중'}
          {phase === 'scenario' && '시나리오'}
          {phase === 'practice' && '음성 대화'}
          {phase === 'completed' && '평가 완료'}
        </span>
      </header>

      <div className="coaching-chat-log" ref={chatLogRef}>
        <div className="coaching-chat-mascot" aria-hidden="true">
          <span className="mascot-antenna" />
          <span className="mascot-face">
            <i />
            <i />
          </span>
          <span className="mascot-body" />
        </div>

        {messages.map((message) =>
          message.type === 'voice' ? (
            <VoiceMessageBubble key={message.id} message={message} />
          ) : (
            <article key={message.id} className={`coaching-message-row is-${message.role}`}>
              {message.role === 'ai' && <div className="coaching-avatar">AI</div>}
              <div className="coaching-text-bubble">
                <span>{message.speaker}</span>
                <p>{message.text}</p>

                {message.scenarioTitle && (
                  <div className="coaching-message-note">
                    <strong>{message.scenarioTitle}</strong>
                    <p>{message.scenarioGoal}</p>
                  </div>
                )}

                {message.keySentences && (
                  <ul className="coaching-key-sentences">
                    {message.keySentences.map((sentence) => (
                      <li key={sentence}>{sentence}</li>
                    ))}
                  </ul>
                )}

                {message.evaluation && (
                  <div className="coaching-evaluation-lines">
                    <strong>다음 포인트</strong>
                    <p>{message.evaluation.nextFocus}</p>
                  </div>
                )}

                {message.quickReplies && (
                  <CoachingModeSelector
                    modes={message.quickReplies.map((reply) => ({
                      id: reply.id,
                      label: reply.label,
                      modeId: reply.modeId,
                    }))}
                    selectedModeId=""
                    onSelect={(replyId) => {
                      const reply = message.quickReplies.find((item) => item.id === replyId);
                      handleQuickReply(reply);
                    }}
                  />
                )}
              </div>
            </article>
          ),
        )}
      </div>

      <form
        className="coaching-chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={isRecording ? '음성 로그 기록 중... 다시 누르면 전송돼요.' : '메시지를 입력하세요...'}
        />
        <button
          type="button"
          className={`coaching-mic-button ${isRecording ? 'is-recording' : ''}`}
          onClick={handleMicClick}
          aria-label={isRecording ? '음성 로그 종료' : '음성 로그 시작'}
        >
          <span className="coaching-mic-icon" aria-hidden="true" />
        </button>
        <button type="submit" className="coaching-send-button" aria-label="메시지 전송">
          ▶
        </button>
      </form>
    </section>
  );
}

export default CoachingChatSection;
