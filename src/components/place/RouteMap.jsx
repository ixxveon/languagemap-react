import { useEffect, useMemo, useRef } from 'react';
import PlaceMap from './PlaceMap';
import MissionBoard from './MissionBoard';
import ChatPanel from './ChatPanel';
import PlaceDetailPanel from './PlaceDetailPanel';
import GuidePanel from './GuidePanel';
import CapitalFilter from './CapitalFilter';

function RouteMap({
  places,
  capitals,
  activeCapitalId,
  selectedCapital,
  selectedPlace,
  panelVisible,
  panelMode,
  chatLog,
  chatInput,
  chatCompleted,
  selectedLevel,
  onChatInputChange,
  onSelectLevel,
  onSendMessage,
  onSelectCapital,
  onSelectPlace,
  onClosePanel,
  onStartLearning,
  onBackToDetail,
  onOpenCoaching,
  onStartMission,
  learningSession,
  activeMissionId,
  completedMissionIds = [],
  onCompleteMission,
}) {
  const chatLogRef = useRef(null);

  const visiblePlaces = places;

  const activeCapital = useMemo(() => {
    return capitals.find((capital) => capital.id === activeCapitalId) ?? capitals[0];
  }, [activeCapitalId, capitals]);

  const selectedPlaceId = selectedPlace?.id ?? '';

  useEffect(() => {
    if (panelMode !== 'chat') {
      return;
    }

    const chatLogElement = chatLogRef.current;

    if (!chatLogElement) {
      return;
    }

    chatLogElement.scrollTo({
      top: chatLogElement.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatCompleted, chatLog.length, panelMode]);

  return (
    <section className="map-domain-map-panel">
      <div className="map-domain-map-frame">
        <PlaceMap
          places={visiblePlaces}
          activeCapital={activeCapital}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={onSelectPlace}
        />
        <div className="map-domain-top-overlay">
          <CapitalFilter
            capitals={capitals}
            activeCapitalId={activeCapitalId}
            onSelectCapital={onSelectCapital}
          />
          <div className="map-domain -floating-summary">
            <article className="map-domain-mini-card">
              <span>나라</span>
              <strong>{selectedCapital.country}</strong>
            </article>
            <article className="map-domain-mini-card">
              <span>도시</span>
              <strong>{selectedCapital.capital}</strong>
            </article>
          </div>
        </div>

        <div className={`map-domain-left-overlay ${panelMode === 'chat' ? 'is-chat-centered' : ''}`}>
          {panelVisible && selectedPlace ? (
            <div className="map-domain-panel map-domain-panel-overlay">
              {panelMode === 'chat' ? (
                <ChatPanel
                  chatLog={chatLog}
                  chatInput={chatInput}
                  chatCompleted={chatCompleted}
                  onChatInputChange={onChatInputChange}
                  onSendMessage={onSendMessage}
                  onBackToDetail={onBackToDetail}
                  onClosePanel={onClosePanel}
                  onOpenCoaching={onOpenCoaching}
                  chatLogRef={chatLogRef}
                />
              ) : (
                <PlaceDetailPanel
                  selectedPlace={selectedPlace}
                  selectedCapital={selectedCapital}
                  selectedLevel={selectedLevel}
                  onSelectLevel={onSelectLevel}
                  onStartLearning={onStartLearning}
                  onClosePanel={onClosePanel}
                />
              )}
            </div>
          ) : (
            <GuidePanel />
          )}
        </div>

        <div className="map-domain-right-overlay">
          <MissionBoard
            selectedPlace={selectedPlace}
            selectedCapital={selectedCapital}
            learningSession={learningSession}
            activeMissionId={activeMissionId}
            completedMissionIds={completedMissionIds}
            onStartMission={onStartMission}
            onCompleteMission={onCompleteMission}
          />
        </div>
      </div>
    </section>
  );
}

export default RouteMap;
