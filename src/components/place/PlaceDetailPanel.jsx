function PlaceDetailPanel({
    selectedPlace,
    selectedCapital,
    selectedLevel,
    onSelectLevel,
    onStartLearning,
    onClosePanel,
}) {
    return (
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
                    {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                        <button
                            key={level}
                            type="button"
                            className={`map-domain-level-button ${selectedLevel === level ? 'is-active' : ''
                                }`}
                            onClick={() => onSelectLevel(level)}
                        >
                            {level}
                        </button>
                    ))}
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