const STAR_PATH =
  'M12 2.4l2.9 5.88 6.49.95-4.69 4.57 1.11 6.46L12 17.2l-5.81 3.06 1.11-6.46-4.69-4.57 6.49-.95L12 2.4z';

function PlaceDetailPanel({
  selectedPlace,
  selectedRegion,
  selectedLevel,
  onSelectLevel,
  onStartLearning,
  onToggleFavoritePlace,
  isFavorite,
  onClosePanel,
}) {
  return (
    <div className="map-domain-panel-inner">
      <div className="map-domain-panel-top">
        <div className="map-domain-panel-heading">
          <div className="map-domain-title-row">
            <button
              type="button"
              className={`map-domain-favorite-button ${isFavorite ? 'is-active' : ''}`}
              onClick={onToggleFavoritePlace}
              aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              aria-pressed={isFavorite}
            >
              <svg
                className="map-domain-favorite-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={STAR_PATH} />
              </svg>
            </button>
            <h2>{selectedPlace.title}</h2>
          </div>
          <p className="map-domain-panel-address">{selectedRegion?.city}</p>
        </div>

        <div className="map-domain-panel-top-actions">
          <button
            type="button"
            className="map-domain-close-button"
            onClick={onClosePanel}
            aria-label="Close place panel"
          >
            ×
          </button>
        </div>
      </div>

      <section className="map-domain-panel-section">
        <h3>나라</h3>
        <p>{selectedRegion?.country}</p>
      </section>

      <section className="map-domain-panel-section">
        <h3>도시</h3>
        <p>{selectedRegion?.city}</p>
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

        <div className="map-domain-level-select-wrap">
          <select
            className="map-domain-level-select"
            value={selectedLevel}
            onChange={(event) => onSelectLevel(event.target.value)}
            aria-label="학습 레벨 선택"
          >
            <option value="BEGINNER">BEGINNER</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
          </select>
        </div>
      </section>

      <div className="map-domain-panel-actions map-domain-detail-actions">
        <button
          type="button"
          className="map-domain-learn-button"
          onClick={onStartLearning}
        >
          학습하기
        </button>
      </div>
    </div>
  );
}

export default PlaceDetailPanel;
