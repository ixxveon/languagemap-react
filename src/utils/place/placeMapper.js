export function toMission(mission) {
    return {
        id: mission.missionId,
        title: mission.missionTitle,
        summary: mission.missionDescription,
    };
}

export function toPlaceDetail(detail, placeId) {
    const missionList = detail.mission ?? detail.missions ?? [];

    return {
        ...detail,
        id: placeId,
        title: detail.placeName ?? `장소 ${placeId}`,
        description: detail.placeDescription ?? '',
        placeType: detail.scenarioCategory ?? '',
        scenario: detail.scenarioDescription ?? '',
        missions: missionList.map(toMission),
        difficulty: 'Starter',
        chatSteps: [],
        feedback: {
            strengths: [],
            improvements: [],
        },
    };
}