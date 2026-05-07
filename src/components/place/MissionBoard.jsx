function MissionBoard({
    selectedPlace,
    selectedCapital,
    learningSession,
    activeMissionId,
    completedMissionIds,
    onStartMission,
    onCompleteMission,
}) {

    return (
        <section className="map-domain-mission-card">
            <div className="map-domain-mission-head">
                <p>Mission Board</p>
                <strong>{selectedPlace ? `${selectedPlace.title} 미션` : `${selectedCapital.capital} 미션`}</strong>
            </div>

            <div className="map-domain-mission-list">
                {(selectedPlace?.missions ?? []).length > 0 ? (
                    selectedPlace.missions.map((mission, index) => {
                        const isCompleted = completedMissionIds
                            .map(Number)
                            .includes(Number(mission.id));
                        const isRunning = Number(activeMissionId) === Number(mission.id);
                        const hasLearningSession = !!learningSession;

                        return (
                            <article key={mission.id} className="map-domain-mission-item">
                                <div className="map-domain-mission-copy">
                                    <span>{`Mission ${index + 1}`}</span>
                                    <h3>{mission.title}</h3>
                                    <p>{mission.summary}</p>
                                </div>

                                <button
                                    type="button"
                                    className="map-domain-mission-button"
                                    onClick={() => {
                                        if (!hasLearningSession) {
                                            return;
                                        }

                                        if (isRunning) {
                                            onCompleteMission(mission.id);
                                            return;
                                        }

                                        onStartMission(mission.id);
                                    }}
                                    disabled={isCompleted}
                                >
                                    {isCompleted
                                        ? '완료됨'
                                        : isRunning
                                            ? '미션 종료'
                                            : hasLearningSession
                                                ? '미션 시작'
                                                : '내용 확인'}
                                </button>
                            </article>
                        );
                    })
                ) : (
                    <div className="map-domain-mission-empty">
                        <strong>마커를 누르면 장소별 미션이 여기에 표시됩니다.</strong>
                        <p>선택한 장소에 맞는 영어 학습 미션을 리스트로 확인할 수 있습니다.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default MissionBoard;






