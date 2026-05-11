import axiosInstance from '../axiosInstance';

async function readMissions(keyword = '') {
    const response = await axiosInstance.get('/api/admin/missions', {
        params: { keyword },
    });

    return response.data;
}

async function readMissionDetail(missionId) {
    const response = await axiosInstance.get(`/api/admin/missions/${missionId}`);

    return response.data;
}

async function createMission(request) {
    await axiosInstance.post('/api/admin/missions', request);
}

async function updateMission(missionId, request) {
    await axiosInstance.patch(`/api/admin/missions/${missionId}`, request);
}

async function deleteMission(missionId) {
    await axiosInstance.delete(`/api/admin/missions/${missionId}`);
}

export const adminMissionService = {
    readMissions,
    readMissionDetail,
    createMission,
    updateMission,
    deleteMission,
};