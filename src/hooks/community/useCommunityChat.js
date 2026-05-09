import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMapingoStore } from '../../store/user/useMapingoStore';

const CHAT_SOCKET_URL = 'http://localhost:8080/ws';

const formatChatTime = (sentAt) => {
  if (!sentAt) return '지금';

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(sentAt));
};

const maskDisplayName = (name, fallback = '사용자') => {
  const normalizedName = String(name ?? '').trim();
  const displayName = normalizedName || fallback;

  if (displayName.includes('@')) {
    const [localPart, domain] = displayName.split('@');
    const localCharacters = Array.from(localPart);
    const maskedLocalPart =
      localCharacters.length <= 2
        ? `${localCharacters[0] ?? '*'}*`
        : `${localCharacters[0]}${'*'.repeat(localCharacters.length - 2)}${localCharacters.at(-1)}`;

    return domain ? `${maskedLocalPart}@${domain}` : maskedLocalPart;
  }

  const characters = Array.from(displayName);

  if (characters.length <= 1) return '*';
  if (characters.length === 2) return `${characters[0]}*`;

  return `${characters[0]}${'*'.repeat(characters.length - 2)}${characters.at(-1)}`;
};

const normalizeChatMessage = (message, currentUserId) => {
  const type = message.type ?? 'CHAT';
  const isSystem = type === 'ENTER' || type === 'LEAVE';
  const isMine = Number(message.userId) === Number(currentUserId);
  const maskedNickname = maskDisplayName(
    message.nickname,
    `사용자 ${message.userId ?? ''}`,
  );
  const systemMessage =
    type === 'LEAVE'
      ? `${maskedNickname}님이 퇴장했습니다.`
      : `${maskedNickname}님이 입장했습니다.`;

  return {
    id: `${type}-${message.userId ?? 'system'}-${message.sentAt ?? Date.now()}-${message.message ?? ''}`,
    type,
    role: isSystem ? 'system' : isMine ? 'user' : 'mate',
    author: isSystem ? '알림' : maskedNickname,
    text: isSystem ? systemMessage : message.message ?? '',
    time: formatChatTime(message.sentAt),
  };
};

const normalizeParticipantCount = (payload) => {
  if (typeof payload === 'number') return payload;
  return payload?.count ?? 0;
};

export function useCommunityChat() {
  const currentUserId = useMapingoStore((state) => state.session?.user?.userId);
  const [messages, setMessages] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const clientRef = useRef(null);
  const currentUserIdRef = useRef(currentUserId);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setConnectionStatus('unauthorized');
      return undefined;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(CHAT_SOCKET_URL),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 3000,
      debug: () => {},
      onConnect: () => {
        setConnectionStatus('connected');

        client.subscribe('/topic/chat', (frame) => {
          const payload = JSON.parse(frame.body);
          setMessages((currentMessages) => [
            ...currentMessages,
            normalizeChatMessage(payload, currentUserIdRef.current),
          ]);
        });

        client.subscribe('/topic/chat/participants', (frame) => {
          const payload = JSON.parse(frame.body);
          setParticipantCount(normalizeParticipantCount(payload));
        });

        client.publish({
          destination: '/app/chat/enter',
          body: JSON.stringify({}),
        });
      },
      onStompError: () => {
        setConnectionStatus('error');
      },
      onWebSocketError: () => {
        setConnectionStatus('error');
      },
      onDisconnect: () => {
        setConnectionStatus('disconnected');
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (client.connected) {
        client.publish({
          destination: '/app/chat/leave',
          body: JSON.stringify({}),
        });
      }

      client.deactivate();
      clientRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((nextMessage) => {
    const trimmed = nextMessage.trim();
    const client = clientRef.current;

    if (!trimmed || !client?.connected) return;

    client.publish({
      destination: '/app/chat/send',
      body: JSON.stringify({ message: trimmed }),
    });

    setChatInput('');
  }, []);

  const liveStatus = useMemo(() => {
    if (connectionStatus === 'connected') {
      return `${participantCount}명 참여 중`;
    }

    if (connectionStatus === 'unauthorized') {
      return '로그인 필요';
    }

    if (connectionStatus === 'error') {
      return '연결 실패';
    }

    return '연결 중';
  }, [connectionStatus, participantCount]);

  return {
    chatInput,
    setChatInput,
    messages,
    sendMessage,
    liveStatus,
    connectionStatus,
  };
}
