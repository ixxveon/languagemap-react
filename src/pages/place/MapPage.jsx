import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeService } from '../../api/place/placeService';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import { toPlaceDetail } from '../../utils/place/placeMapper';
import RouteMap from '../../components/place/RouteMap';
import '../../styles/user/mapPage.css';

function buildAiReply(place, userInput, turn) {
  const normalized = userInput.trim().toLowerCase();

  if (!normalized) {
    return 'Could you say that one more time?';
  }

  if (normalized.includes('hello') || normalized.includes('hi')) {
    return `Hello. We are practicing the ${place.title} scenario, so feel free to speak naturally.`;
  }

  if (normalized.includes('thank')) {
    return 'You are welcome. Keep the conversation going just like a real place interaction.';
  }

  if (normalized.includes('?')) {
    return `That question works well here. In this ${place.placeType.toLowerCase()} scenario, you can also ask for more detail if you need it.`;
  }

  if (turn === 0) {
    return place.chatSteps[1]?.prompt ?? 'Sounds good. Can you tell me a bit more?';
  }

  if (turn === 1) {
    return place.chatSteps[2]?.prompt ?? 'Great. Is there anything else you would like to ask?';
  }

  if (turn === 2) {
    return `Nice work. That sounded natural for the ${place.title} situation. Let me wrap up with quick feedback.`;
  }

  if (turn > 4) {
    return `Nice work. Your English fits the ${place.title} situation well. You can wrap up the conversation whenever you are ready.`;
  }

  return `That sounds natural for ${place.category}. Try adding one more sentence to make the conversation richer.`;
}

function buildEvaluationMessage(place) {
  const firstStrength = place.feedback?.strengths?.[0] ?? '핵심 표현을 자연스럽게 연결했어요.';
  const firstImprovement = place.feedback?.improvements?.[0] ?? '한 문장만 더 덧붙이면 대화가 더 풍부해져요.';

  return `${place.title} 상황에서 주문 흐름은 좋았어요. 강점은 ${firstStrength} 개선 포인트는 ${firstImprovement} 이번에는 어떤 방향으로 더 깊게 연습하고 싶으세요?`;
}

function MapPage() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);
  const capitals = placeService.fetchPlaceTabs();
  const [learningSession, setLearningSession] = useState(null);
  const [activeMissionId, setActiveMissionId] = useState(null);
  const [completedMissionIds, setCompletedMissionIds] = useState([]);
  const activeCapitalId = useMapingoStore((state) => state.mapActiveTab);
  const selectedPlaceId = useMapingoStore((state) => state.selectedRouteId);
  const setActiveCapitalId = useMapingoStore((state) => state.setMapActiveTab);
  const setSelectedPlaceId = useMapingoStore((state) => state.setSelectedRouteId);
  const setRecentMapChatLog = useMapingoStore((state) => state.setRecentMapChatLog);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelMode, setPanelMode] = useState('guide');
  const [chatLog, setChatLog] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatCompleted, setChatCompleted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('Starter');

  useEffect(() => {
    const loadPlaceMarkers = async () => {
      try {
        const data = await placeService.readPlaceMarkers();
        setPlaces(data);

        console.log('장소 마커 목록 조회 성공:', data);
      } catch (error) {
        console.error('장소 마커 목록 조회 실패:', error);
        alert('장소 목록을 불러오지 못했습니다.');
      }
    };

    loadPlaceMarkers();
  }, []);

  useEffect(() => {
    const pageShell = document.querySelector('.mapingo-page-shell');
    document.body.classList.add('map-domain-scroll-lock');
    pageShell?.classList.add('map-domain-page-shell');

    return () => {
      document.body.classList.remove('map-domain-scroll-lock');
      pageShell?.classList.remove('map-domain-page-shell');
    };
  }, []);

  const currentCapitalId = capitals.some((capital) => capital.id === activeCapitalId) ? activeCapitalId : 'all';

  const visiblePlaces = useMemo(() => {
    if (currentCapitalId === 'all') {
      return places;
    }

    return places.filter((place) => place.capitalId === currentCapitalId);
  }, [currentCapitalId, places]);

  const selectedPlace = selectedPlaceDetail;

  const selectedCapital = useMemo(() => {
    return capitals.find((capital) => capital.id === currentCapitalId) ?? capitals[0];
  }, [capitals, currentCapitalId]);

  const resetChatState = () => {
    setChatLog([]);
    setChatInput('');
    setChatCompleted(false);
    setRecentMapChatLog([]);
  };

  const handleCapitalChange = (capitalId) => {
    setActiveCapitalId(capitalId);
    setSelectedPlaceId('');
    setPanelVisible(false);
    setPanelMode('guide');
    setSelectedLevel('Starter');
    resetChatState();
  };

  const handleSelectPlace = async (placeId) => {
    if (!placeId) {
      setSelectedPlaceId('');
      setSelectedPlaceDetail(null);
      setPanelVisible(false);
      setPanelMode('guide');
      setSelectedLevel('Starter');
      resetChatState();
      return;
    }

    try {
      setSelectedPlaceId(placeId);

      const detail = await placeService.readPlaceDetail(placeId);

      console.log('장소 상세 조회:', detail);

      setSelectedPlaceDetail(toPlaceDetail(detail, placeId));

      setPanelVisible(true);
      setPanelMode('detail');
      setSelectedLevel('Starter');
      resetChatState();
    } catch (error) {
      console.error('장소 상세 조회 실패:', error);
      alert('장소 상세 정보를 불러오지 못했습니다.');
    }
  };

  const handleStartLearning = async () => {
    if (!selectedPlace) {
      return;
    }

    try {
      const request = {
        userId: 1, // TODO: 로그인 연결 후 현재 로그인 userId로 교체
        level: selectedLevel,
      };

      const session = await placeService.startLearningSession(
        selectedPlace.id,
        request
      );

      console.log('학습 세션 생성 성공:', session);

      setLearningSession(session);

      setPanelVisible(true);
      setPanelMode('chat');
      setChatInput('');

      const initialLog = [
        {
          role: 'ai',
          speaker: 'AI Coach',
          text: `${selectedPlace.title} 학습 세션이 시작되었습니다. 이제 미션을 선택해서 대화를 시작해보세요.`,
        },
      ];

      setChatLog(initialLog);
      setRecentMapChatLog(initialLog);
    } catch (error) {
      console.error('학습 세션 생성 실패:', error);
      alert('학습 세션을 시작하지 못했습니다.');
    }
  };

  const findMissionSessionId = (missionId) => {
    return learningSession?.missionSessions?.find(
      (missionSession) => missionSession.missionId === missionId
    )?.missionSessionId;
  };

  const handleStartMission = async (missionId) => {
    if (!learningSession) {
      alert('먼저 학습 세션을 시작해주세요.');
      return;
    }

    if (Number(activeMissionId) === Number(missionId)) {
      return;
    }

    try {
      const response = await placeService.startMissionSession(
        learningSession.learningSessionId,
        missionId
      );

      console.log('미션 세션 시작 성공:', response);

      setActiveMissionId(Number(missionId));

      const aiMessage = {
        role: 'ai',
        speaker: 'AI Coach',
        text: response.aiMessage,
      };

      setPanelVisible(true);
      setPanelMode('chat');
      setChatInput('');
      setChatCompleted(false);
      setChatLog((prev) => [...prev, aiMessage]);
      setRecentMapChatLog((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('미션 세션 시작 실패:', error);
      alert('미션을 시작하지 못했습니다.');
    }
  };

  const handleSendMessage = async () => {
    if (!learningSession || !activeMissionId || chatCompleted) {
      return;
    }

    const trimmed = chatInput.trim();

    if (!trimmed) {
      return;
    }

    const userMessage = {
      role: 'user',
      speaker: 'You',
      text: trimmed,
    };

    setChatLog((prev) => [...prev, userMessage]);
    setRecentMapChatLog((prev) => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await placeService.sendChatMessage({
        sessionId: learningSession.learningSessionId,
        message: trimmed,
      });

      const aiMessage = {
        role: 'ai',
        speaker: 'AI Coach',
        text: response.aiMessage,
      };

      setChatLog((prev) => [...prev, aiMessage]);
      setRecentMapChatLog((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('채팅 응답 실패:', error);
      alert('AI 응답을 불러오지 못했습니다.');
    }
  };

  const handleCompleteMission = async () => {
    if (!learningSession || !activeMissionId) {
      return;
    }

    try {
      const response = await placeService.completeMissionSession(
        learningSession.learningSessionId,
        activeMissionId
      );

      console.log('미션 완료 성공:', response);

      const evaluationMessage = {
        role: 'ai',
        speaker: 'AI Coach',
        text: response.aiFeedback ?? response.evaluation ?? response.aiMessage ?? '미션 평가를 불러오지 못했습니다.',
        kind: 'evaluation',
      };

      setChatLog((prev) => [...prev, evaluationMessage]);
      setRecentMapChatLog((prev) => [...prev, evaluationMessage]);

      setCompletedMissionIds((prev) => [...prev, Number(activeMissionId)]);
      setActiveMissionId(null);
      setChatCompleted(true);
    } catch (error) {
      console.error('미션 완료 실패:', error);
      alert('미션 완료 처리에 실패했습니다.');
    }
  };

  const handleBackToDetail = () => {
    setPanelMode(selectedPlace ? 'detail' : 'guide');
    resetChatState();
  };

  return (
    <div className="map-domain-page">
      <section className="map-domain-shell">
        <RouteMap
          places={places}
          capitals={capitals}
          activeCapitalId={currentCapitalId}
          selectedCapital={selectedCapital}
          selectedPlace={selectedPlace}
          panelVisible={panelVisible}
          panelMode={panelMode}
          chatLog={chatLog}
          chatInput={chatInput}
          chatCompleted={chatCompleted}
          selectedLevel={selectedLevel}
          onChatInputChange={setChatInput}
          onSelectLevel={setSelectedLevel}
          onSendMessage={handleSendMessage}
          onSelectCapital={handleCapitalChange}
          onSelectPlace={handleSelectPlace}
          onClosePanel={() => handleSelectPlace(null)}
          onStartLearning={handleStartLearning}
          onBackToDetail={handleBackToDetail}
          onOpenCoaching={() => navigate('/coaching')}
          learningSession={learningSession}
          onStartMission={handleStartMission}
          activeMissionId={activeMissionId}
          completedMissionIds={completedMissionIds}
          onCompleteMission={handleCompleteMission}
        />
      </section>
    </div>
  );
}

export default MapPage;
