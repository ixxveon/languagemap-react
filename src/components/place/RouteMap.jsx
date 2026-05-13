import { useEffect, useMemo, useRef } from 'react';
import PlaceMap from './PlaceMap';
import MissionBoard from './MissionBoard';
import ChatPanel from './ChatPanel';
import PlaceDetailPanel from './PlaceDetailPanel';
import GuidePanel from './GuidePanel';
import CapitalFilter from './CapitalFilter';

function RouteMap({
  places,
  regions = [],
  activeRegionId,
  onSelectRegion,
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
  onSelectPlace,
  onClosePanel,
  onStartLearning,
  onBackToDetail,
  onToggleFavoritePlace,
  isSelectedPlaceFavorite,
  onOpenCoaching,
  onStartMission,
  learningSession,
  activeMissionId,
  completedMissionIds = [],
  onCompleteMission,
  remainingChatCount,
  chatLimit,
  missionActionLoading,
}) {
  const chatLogRef = useRef(null);

  const visiblePlaces = places;

  const selectedRegion = useMemo(() => {
    return regions.find(
      (region) => Number(region.regionId) === Number(activeRegionId)
    ) ?? regions[0];
  }, [regions, activeRegionId]);

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
          activeRegion={selectedRegion}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={onSelectPlace}
        />
        <div className="map-domain-top-overlay">
          <CapitalFilter
            regions={regions}
            activeRegionId={activeRegionId}
            onSelectRegion={onSelectRegion}
          />
          <div className="map-domain-floating-summary">
            <article className="map-domain-mini-card">
              <span>나라</span>
              <strong>{selectedRegion?.country ?? '-'}</strong>
            </article>
            <article className="map-domain-mini-card">
              <span>도시</span>
              <strong>{selectedRegion?.city ?? '-'}</strong>
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
                  remainingChatCount={remainingChatCount}
                  chatLimit={chatLimit}
                />
              ) : (
                <PlaceDetailPanel
                  selectedPlace={selectedPlace}
                  selectedRegion={selectedRegion}
                  selectedLevel={selectedLevel}
                  onSelectLevel={onSelectLevel}
                  onStartLearning={onStartLearning}
                  onToggleFavoritePlace={onToggleFavoritePlace}
                  isFavorite={isSelectedPlaceFavorite}
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
            selectedRegion={selectedRegion}
            learningSession={learningSession}
            activeMissionId={activeMissionId}
            completedMissionIds={completedMissionIds}
            onStartMission={onStartMission}
            onCompleteMission={onCompleteMission}
            missionActionLoading={missionActionLoading}
          />
        </div>
      </div>
    </section>
  );
}

export default RouteMap;
