import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import DemoFlowCompact from '../../components/user/DemoFlowCompact';
import { useCommunityChat } from '../../hooks/community/useCommunityChat';

import '../../styles/user/CommunityPage.css';

const communityEntryCards = [
  {
    id: 'friends',
    accent: '연결 관리',
    title: '친구 관리',
    description:
      '친구 요청을 확인하고 새 친구를 추가하면서 함께 공부할 학습 메이트를 정리해보세요.',
    path: '/community/friends',
  },
  {
    id: 'ranking',
    accent: '순위 확인',
    title: '점수 비교와 랭킹',
    description:
      '친구들과 학습 기록을 비교하고, 전체 사용자 안에서 내 위치를 빠르게 확인할 수 있어요.',
    path: '/community/ranking',
  },
  {
    id: 'learning',
    accent: '학습 관리',
    title: '학습 목표',
    description: '진행 중인 목표를 확인하고 새로운 학습 목표를 설정해보세요.',
    path: '/community/learning',
  },
  {
    id: 'favorites',
    accent: '학습 보관함',
    title: '즐겨찾기',
    description:
      '자주 보는 학습 루트와 관심 콘텐츠를 한 번에 모아 관리해보세요.',
    path: '/community/favorites',
  },
];

const starterMessages = [
  '오늘 영어 회화 루틴 같이 할 사람?',
  '여행 표현 연습할 분 있나요?',
  '방금 배운 문장 같이 복습해요.',
];

function CommunityPage() {
  const navigate = useNavigate();
  const chatLogRef = useRef(null);
  const {
    chatInput,
    setChatInput,
    messages,
    sendMessage,
    liveStatus,
    connectionStatus,
  } = useCommunityChat();

  useEffect(() => {
    const chatLog = chatLogRef.current;
    if (!chatLog) return;

    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const canSend = connectionStatus === 'connected';

  return (
    <div className="mapingo-dashboard">
      <section className="community-landing">
        <div className="community-landing-hero is-chat-only">
          <div className="community-landing-panel is-full">
            <div className="community-landing-highlight is-chat">
              <div className="community-live-chat-head">
                <div>
                  <span>실시간 채팅</span>
                  <strong>같이 공부하는 사람들과 지금 바로 대화해보세요</strong>
                </div>
                <em>{liveStatus}</em>
              </div>

              <div className="community-live-chat-log" ref={chatLogRef}>
                {messages.length === 0 ? (
                  <div className="community-live-chat-row is-system">
                    <div className="community-live-chat-system-pill">
                      {connectionStatus === 'connected'
                        ? '채팅방에 입장했어요. 첫 메시지를 보내보세요.'
                        : '실시간 채팅 서버에 연결하고 있어요.'}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`community-live-chat-row is-${message.role}`}
                    >
                      {message.role === 'system' ? (
                        <div className="community-live-chat-system-pill">
                          {message.text}
                        </div>
                      ) : (
                        <div className="community-live-chat-message-group">
                          {message.role === 'mate' ? (
                            <span className="community-live-chat-author">
                              {message.author}
                            </span>
                          ) : null}

                          <div className="community-live-chat-message-line">
                            {message.role === 'user' ? (
                              <small className="community-live-chat-time">
                                {message.time}
                              </small>
                            ) : null}

                            <article
                              className={`community-live-chat-bubble is-${message.role}`}
                            >
                              <p>{message.text}</p>
                            </article>

                            {message.role === 'mate' ? (
                              <small className="community-live-chat-time">
                                {message.time}
                              </small>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="community-live-chat-suggestions">
                {starterMessages.map((message) => (
                  <button
                    key={message}
                    type="button"
                    className="community-live-chat-chip"
                    onClick={() => sendMessage(message)}
                    disabled={!canSend}
                  >
                    {message}
                  </button>
                ))}
              </div>

              <div className="community-live-chat-composer">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      sendMessage(chatInput);
                    }
                  }}
                  disabled={!canSend}
                  placeholder={
                    canSend
                      ? '같이 연습할 주제나 메시지를 보내보세요.'
                      : '채팅 서버에 연결 중이에요.'
                  }
                />
                <button
                  type="button"
                  onClick={() => sendMessage(chatInput)}
                  disabled={!canSend || !chatInput.trim()}
                >
                  보내기
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="community-landing-grid">
          {communityEntryCards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={`community-entry-card is-${card.id}`}
              onClick={() => navigate(card.path)}
            >
              <div className="community-entry-card-top">
                <span className="community-entry-accent">{card.accent}</span>
                <span className="community-entry-index">{`0${index + 1}`}</span>
              </div>

              <div className="community-entry-card-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <DemoFlowCompact activePath="/community" />
    </div>
  );
}

export default CommunityPage;
