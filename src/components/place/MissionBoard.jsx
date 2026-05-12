function MissionBoard({
    selectedPlace,
    selectedRegion,
    learningSession,
    activeMissionId,
    completedMissionIds,
    onStartMission,
    onCompleteMission,
    missionActionLoading = null,
}) {

    return (
        <section className="map-domain-mission-card">
            <div className="map-domain-mission-head">
                <p>Mission Board</p>
                <strong>{selectedPlace ? `${selectedPlace.title} 미션` : `${selectedRegion?.city} 미션`}</strong>
            </div>

            <div className="map-domain-mission-list">
                {(selectedPlace?.missions ?? []).length > 0 ? (
                    selectedPlace.missions.map((mission, index) => {
                        const isLoading =
                            Number(missionActionLoading?.missionId) === Number(mission.id);

                        const isStartLoading =
                            isLoading && missionActionLoading?.type === 'start';

                        const isCompleteLoading =
                            isLoading && missionActionLoading?.type === 'complete';

                        const isCompleted = completedMissionIds
                            .map(Number)
                            .includes(Number(mission.id));

                        const isRunning = Number(activeMissionId) === Number(mission.id);

                        const hasActiveMission =
                            activeMissionId !== null && activeMissionId !== undefined;

                        const isAnotherMissionRunning =
                            hasActiveMission && !isRunning;

                        const hasLearningSession = !!learningSession;

                        return (
                            <article key={mission.id} className="map-domain-mission-item">
                                <div className="map-domain-mission-copy">
                                    <span>{`Mission ${index + 1}`}</span>
                                    <h3>{mission.title}</h3>
                                    <p>{mission.summary}</p>
                                </div>

                                {hasLearningSession && (
                                    <button
                                        type="button"
                                        className="map-domain-mission-button"
                                        onClick={() => {
                                            if (isAnotherMissionRunning) {
                                                alert('진행중인 미션을 종료한 뒤 새로운 미션을 시작해주세요.');
                                                return;
                                            }

                                            if (isRunning) {
                                                onCompleteMission(mission.id);
                                                return;
                                            }

                                            onStartMission(mission.id);
                                        }}
                                        disabled={
                                            isCompleted ||
                                            missionActionLoading !== null
                                        }
                                    >
                                        {isCompleted
                                            ? '완료됨'
                                            : isStartLoading
                                                ? '미션 시작하는중...'
                                                : isCompleteLoading
                                                    ? '미션 종료하는중...'
                                                    : isRunning
                                                        ? '미션 종료'
                                                        : '미션 시작'}
                                    </button>
                                )}
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