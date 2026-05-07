import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoFlowCompact from '../../components/user/DemoFlowCompact';
import '../../styles/user/CommunityPage.css';

const communityEntryCards = [
  {
    id: 'friends',
    accent: '연결 관리',
    title: '친구 관리',
    description: '친구 요청을 확인하고 학습 메이트를 관리해보세요.',
    path: '/community/friends',
  },
  {
    id: 'ranking',
    accent: '순위 확인',
    title: '점수 비교와 랭킹',
    description: '친구들과 점수를 비교하고 랭킹을 확인해보세요.',
    path: '/community/ranking',
  },
  {
    id: 'learning', 
    accent: '학습 관리',
    title: '학습 목표',
    description: '학습 목표를 설정하고 진행도를 확인해보세요.',
    path: '/community/learning',
  },
  {
    id: 'favorites',  
    accent: '학습 보관함',
    title: '즐겨찾기',
    description: '자주 보는 학습 루트를 모아 관리해보세요.',
    path: '/community/favorites',
  },
];

const starterMessages = [
  '오늘 영어 회화 루틴 같이 할 사람?',
  '여행 표현 연습할 분 있나요?',
  '방금 배운 문장 같이 복습해요.',
];

const initialMessages = [
  {
    id: 1,
    role: 'mate',
    author: 'Mina',
    text: '오늘 출근 전에 10분 회화 연습 같이 하실 분?',
    time: '방금',
  },
  {
    id: 2,
    role: 'mate',
    author: 'Daniel',
    text: '저는 여행 영어 표현 복습 중이에요. 같이 해도 좋아요.',
    time: '1분 전',
  },
];

function buildCommunityReply(message) {
  if (message.includes('회화')) {
    return {
      author: 'Mina',
      text: '좋아요. 오늘은 자기소개랑 아침 루틴 표현부터 같이 해봐요.',
    };
  }

  if (message.includes('여행')) {
    return {
      author: 'Daniel',
      text: '좋아요. 공항 체크인부터 카페 주문까지 차례로 연습해봐요.',
    };
  }

  if (message.includes('복습')) {
    return {
      author: 'Sora',
      text: '복습방 열어둘게요. 오늘 배운 문장 한 줄씩 남겨봐요.',
    };
  }

  return {
    author: 'Community Bot',
    text: '좋아요. 같은 주제로 연습 중인 사람들에게 바로 보여줄게요.',
  };
}

function CommunityPage() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const liveStatus = useMemo(() => {
    const mateCount = messages.filter((message) => message.role === 'mate').length;
    return `${mateCount + 10}명 참여 중`;
  }, [messages]);

  const sendMessage = (nextMessage) => {
    const trimmed = nextMessage.trim();

    if (!trimmed) return;

    const reply = buildCommunityReply(trimmed);

    setMessages((current) => [
      ...current,
      {
        id: current.length + 1,
        role: 'user',
        author: '나',
        text: trimmed,
        time: '지금',
      },
      {
        id: current.length + 2,
        role: 'mate',
        author: reply.author,
        text: reply.text,
        time: '방금',
      },
    ]);
    setChatInput('');
  };

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

              <div className="community-live-chat-log">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`community-live-chat-row is-${message.role}`}
                  >
                    <article
                      className={`community-live-chat-bubble is-${message.role}`}
                    >
                      <div className="community-live-chat-meta">
                        <span>{message.author}</span>
                        <small>{message.time}</small>
                      </div>
                      <p>{message.text}</p>
                    </article>
                  </div>
                ))}
              </div>

              <div className="community-live-chat-suggestions">
                {starterMessages.map((message) => (
                  <button
                    key={message}
                    type="button"
                    className="community-live-chat-chip"
                    onClick={() => sendMessage(message)}
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
                  placeholder="같이 연습할 주제나 한마디를 보내보세요"
                />
                <button type="button" onClick={() => sendMessage(chatInput)}>
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
