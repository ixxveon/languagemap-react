import { useEffect, useMemo, useRef } from 'react';

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

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
}) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const chatLogRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const visiblePlaces = useMemo(() => {
    if (activeCapitalId === 'all') {
      return places;
    }

    return places.filter((place) => place.capitalId === activeCapitalId);
  }, [activeCapitalId, places]);

  const activeCapital = useMemo(() => {
    return capitals.find((capital) => capital.id === activeCapitalId) ?? capitals[0];
  }, [activeCapitalId, capitals]);

  const selectedPlaceId = selectedPlace?.id ?? '';

  useEffect(() => {
    if (!apiKey) {
      return undefined;
    }

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapElementRef.current) {
          return;
        }

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapElementRef.current, {
            center: activeCapital.center,
            zoom: activeCapital.zoom,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            clickableIcons: false,
            gestureHandling: 'greedy',
            zoomControl: true,
            styles: [],
          });

          mapInstanceRef.current.addListener('click', () => onSelectPlace(null));
        }

        const map = mapInstanceRef.current;
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new maps.LatLngBounds();

        visiblePlaces.forEach((place) => {
          const isSelected = place.id === selectedPlaceId;
          const marker = new maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map,
            title: place.title,
            zIndex: isSelected ? 999 : 10,
            icon: {
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
              fillColor: isSelected ? '#155E63' : '#14B8A6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: isSelected ? 1.5 : 1.28,
              anchor: new maps.Point(12, 22),
            },
            label: {
              text: place.placeType.slice(0, 1),
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '700',
            },
          });

          marker.addListener('click', () => onSelectPlace(place.id));
          markersRef.current.push(marker);
          bounds.extend({ lat: place.lat, lng: place.lng });
        });

        if (selectedPlaceId) {
          const currentPlace = visiblePlaces.find((place) => place.id === selectedPlaceId);

          if (currentPlace) {
            map.panTo({ lat: currentPlace.lat, lng: currentPlace.lng });
            map.setZoom(Math.max(activeCapital.zoom, 15));
            return;
          }
        }

        if (visiblePlaces.length === 1) {
          map.panTo({ lat: visiblePlaces[0].lat, lng: visiblePlaces[0].lng });
          map.setZoom(Math.max(activeCapital.zoom, 15));
          return;
        }

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 72);
          return;
        }

        map.panTo(activeCapital.center);
        map.setZoom(activeCapital.zoom);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [activeCapital, apiKey, onSelectPlace, selectedPlaceId, visiblePlaces]);

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
        <div ref={mapElementRef} className={`map-domain-google-map ${!apiKey ? 'is-placeholder' : ''}`}>
          {!apiKey ? (
            <div className="map-domain-map-placeholder-card">
              <strong>Google Maps API key가 연결되면 실제 지도 전체 화면으로 전환됩니다.</strong>
              <p>
                `VITE_GOOGLE_MAPS_API_KEY`를 넣으면 지금 레이아웃 그대로 지도, 마커, 도시 이동 버튼이
                활성화됩니다.
              </p>
            </div>
          ) : null}
        </div>

        <div className="map-domain-top-overlay">
          <div className="map-domain-capital-row" role="tablist" aria-label="capital filters">
            {capitals
              .filter((capital) => capital.id !== 'all')
              .map((capital) => (
                <button
                  key={capital.id}
                  type="button"
                  className={`map-domain-capital-pill ${activeCapitalId === capital.id ? 'is-active' : ''}`}
                  onClick={() => onSelectCapital(capital.id)}
                >
                  {capital.label}
                </button>
              ))}
          </div>

          <div className="map-domain-floating-summary">
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
                <div className="map-domain-panel-inner map-domain-panel-chat map-domain-chat-reference">
                  <div className="map-domain-panel-top map-domain-chat-head">
                    <div>
                      <p className="map-domain-panel-kicker map-domain-chat-title">AI Chat Room</p>
                    </div>
                    <div className="map-domain-chat-head-actions">
                      <button
                        type="button"
                        className="map-domain-close-button map-domain-chat-back"
                        onClick={onBackToDetail}
                        aria-label="Back to detail panel"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="map-domain-close-button map-domain-chat-close"
                        onClick={onClosePanel}
                        aria-label="Close place panel"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="map-domain-chat-surface">
                    <div className="map-domain-live-chat-log map-domain-reference-log" ref={chatLogRef}>
                      {chatLog.map((message, index) => (
                        <article key={`${message.role}-${index}`} className={`map-domain-message-row is-${message.role}`}>
                          {message.role === 'ai' ? (
                            <div className="map-domain-message-avatar" aria-hidden="true">
                              {index === 0 ? 'AI' : '✦'}
                            </div>
                          ) : null}

                          <div className={`map-domain-message-card is-${message.role}`}>
                            {message.role === 'ai' ? (
                              <strong className="map-domain-message-speaker">{message.speaker}</strong>
                            ) : null}
                            <p>{message.text}</p>
                            {message.kind === 'evaluation' ? (
                              <div className="map-domain-follow-up-actions">
                                <button
                                  type="button"
                                  className="map-domain-follow-up-button"
                                  onClick={onOpenCoaching}
                                >
                                  더 알아보기
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </article>
                      ))}

                      {!chatCompleted ? (
                        <div className="map-domain-chat-typing" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="map-domain-chat-inputbar">
                    <input
                      className="map-domain-chat-input"
                      value={chatInput}
                      disabled={chatCompleted}
                      onChange={(event) => onChatInputChange(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          onSendMessage();
                        }
                      }}
                      placeholder={chatCompleted ? '아래 더 알아보기 버튼으로 이어서 연습할 수 있어요.' : 'Type your message...'}
                    />
                    <button
                      type="button"
                      className="map-domain-chat-send"
                      onClick={onSendMessage}
                      aria-label="Send"
                      disabled={chatCompleted}
                    >
                      ➤
                    </button>
                  </div>
                </div>
              ) : (
                <div className="map-domain-panel-inner">
                  <div className="map-domain-panel-top">
                    <div>
                      <h2>{selectedPlace.title}</h2>
                      <p className="map-domain-panel-address">{selectedCapital.capital}</p>
                    </div>
                    <button
                      type="button"
                      className="map-domain-close-button"
                      onClick={onClosePanel}
                      aria-label="Close place panel"
                    >
                      ×
                    </button>
                  </div>

                  <section className="map-domain-panel-section">
                    <h3>나라</h3>
                    <p>{selectedCapital.country}</p>
                  </section>

                  <section className="map-domain-panel-section">
                    <h3>도시</h3>
                    <p>{selectedCapital.capital}</p>
                  </section>

                  <section className="map-domain-panel-section">
                    <h3>장소 설명</h3>
                    <p>{selectedPlace.description}</p>
                  </section>

                  <section className="map-domain-panel-section">
                    <h3>카테고리</h3>
                    <p>{selectedPlace.placeType}</p>
                  </section>

                  <section className="map-domain-panel-section">
                    <h3>학습 시나리오</h3>
                    <p>{selectedPlace.scenario}</p>
                  </section>

                  <section className="map-domain-panel-section">
                    <h3>레벨 선택</h3>
                    <div className="map-domain-level-row">
                      {['Starter', 'Intermediate', 'Advanced'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={`map-domain-level-button ${selectedLevel === level ? 'is-active' : ''}`}
                          onClick={() => onSelectLevel(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </section>

                  <div className="map-domain-panel-actions map-domain-detail-actions">
                    <button type="button" className="map-domain-learn-button" onClick={onStartLearning}>
                      학습하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="map-domain-panel map-domain-panel-overlay map-domain-panel-guide">
              <div className="map-domain-panel-empty">
                <p className="map-domain-panel-kicker">Mapingo Guide</p>
                <h2>마커를 눌러 장소 학습 패널을 열어보세요.</h2>
                <p>수도 버튼으로 도시를 이동하고, 마커를 누르면 장소 설명과 학습 시나리오를 바로 볼 수 있습니다.</p>

                <div className="map-domain-empty-list">
                  <article>
                    <strong>도시 이동</strong>
                    <span>상단 버튼으로 주요 수도를 빠르게 이동합니다.</span>
                  </article>
                  <article>
                    <strong>마커 선택</strong>
                    <span>지도 위 마커를 누르면 상세 장소 패널이 즉시 열립니다.</span>
                  </article>
                  <article>
                    <strong>영어 학습 시작</strong>
                    <span>학습하기를 누르면 실제 채팅방처럼 직접 입력하며 대화할 수 있습니다.</span>
                  </article>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="map-domain-right-overlay">
          <section className="map-domain-mission-card">
            <div className="map-domain-mission-head">
              <p>Mission Board</p>
              <strong>{selectedPlace ? `${selectedPlace.title} 미션` : `${selectedCapital.capital} 미션`}</strong>
            </div>

            <div className="map-domain-mission-list">
              {(selectedPlace?.missions ?? []).length > 0 ? (
                selectedPlace.missions.map((mission, index) => (
                  <article key={mission.id} className="map-domain-mission-item">
                    <div className="map-domain-mission-copy">
                      <span>{`Mission ${index + 1}`}</span>
                      <h3>{mission.title}</h3>
                      <p>{mission.summary}</p>
                    </div>
                    <button type="button" className="map-domain-mission-button">
                      내용 확인
                    </button>
                  </article>
                ))
              ) : (
                <div className="map-domain-mission-empty">
                  <strong>마커를 누르면 장소별 미션이 여기에 표시됩니다.</strong>
                  <p>선택한 장소에 맞는 영어 학습 미션을 리스트로 확인할 수 있습니다.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default RouteMap;
