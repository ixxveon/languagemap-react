import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeService } from '../../api/placeService';
import { useMapingoStore } from '../../store/useMapingoStore';
import RouteMap from '../../components/RouteMap';
import '../../styles/mapPage.css';

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
  const places = placeService.fetchRoutes();
  const capitals = placeService.fetchPlaceTabs();
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

  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) {
      return null;
    }

    return visiblePlaces.find((place) => place.id === selectedPlaceId) ?? null;
  }, [selectedPlaceId, visiblePlaces]);

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

  const handleSelectPlace = (placeId) => {
    if (!placeId) {
      setSelectedPlaceId('');
      setPanelVisible(false);
      setPanelMode('guide');
      setSelectedLevel('Starter');
      resetChatState();
      return;
    }

    setSelectedPlaceId(placeId);
    setPanelVisible(true);
    setPanelMode('detail');
    const nextPlace = places.find((place) => place.id === placeId);
    setSelectedLevel(nextPlace?.difficulty ?? 'Starter');
    resetChatState();
  };

  const handleStartLearning = () => {
    if (!selectedPlace) {
      return;
    }

    setPanelVisible(true);
    setPanelMode('chat');
    setChatInput('');
    const initialLog = [
      {
        role: 'ai',
        speaker: selectedPlace.chatSteps[0]?.speaker ?? 'AI Coach',
        text:
          selectedPlace.chatSteps[0]?.prompt ??
          `Welcome to ${selectedPlace.title}. Start talking to me as if you are really there.`,
      },
    ];

    setChatLog(initialLog);
    setRecentMapChatLog(initialLog);
  };

  const handleSendMessage = () => {
    if (!selectedPlace || chatCompleted) {
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

    const userTurnCount = chatLog.filter((message) => message.role === 'user').length;
    const aiMessage = {
      role: 'ai',
      speaker: selectedPlace.chatSteps[Math.min(userTurnCount + 1, selectedPlace.chatSteps.length - 1)]?.speaker ?? 'AI Coach',
      text: buildAiReply(selectedPlace, trimmed, userTurnCount),
    };

    const nextLog = [...chatLog, userMessage, aiMessage];

    if (userTurnCount + 1 >= selectedPlace.chatSteps.length) {
      nextLog.push({
        role: 'ai',
        speaker: 'AI Coach',
        text: buildEvaluationMessage(selectedPlace),
        kind: 'evaluation',
      });
      setChatCompleted(true);
    }

    setChatLog(nextLog);
    setRecentMapChatLog(nextLog);
    setChatInput('');
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
        />
      </section>
    </div>
  );
}

export default MapPage;
