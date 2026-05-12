import { placeTabOptions, routeCatalog } from '../../mocks/user/placeMockData';
import axiosInstance from '../axiosInstance';

function fetchPlaceTabs() {
  return placeTabOptions;
}

function fetchRoutes() {
  return routeCatalog;
}

function toMarkerPlace(place) {
  return {
    ...place,
    id: place.placeId,
    lat: place.latitude,
    lng: place.longitude,
    regionId: place.regionId
  };
}

async function readPlaceMarkers() {
  const response = await axiosInstance.get('/api/place');
  return response.data.map(toMarkerPlace);
}

async function readPlaceDetail(placeId) {
  const response = await axiosInstance.get(`/api/place/${placeId}`);

  return response.data;
}

async function startLearningSession(placeId, request) {
  const response = await axiosInstance.post(
    `/api/place/${placeId}/learningSessions`,
    request
  );

  return response.data;
}

async function startMissionSession(sessionId, missionId, userId) {
  const response = await axiosInstance.patch(
    `/api/place/learningSessions/${sessionId}/missions/${missionId}`,
    { userId }
  );

  return response.data;
}

async function sendChatMessage(request) {
  const response = await axiosInstance.post('/api/place/chat', request);

  return response.data;
}

async function completeMissionSession(sessionId, missionId, userId) {
  const response = await axiosInstance.patch(
    `/api/place/missionSessions/${sessionId}/missions/${missionId}`,
    { userId }
  );

  return response.data;
}

async function readMyLearningProgress() {
  const response = await axiosInstance.get('/api/place/me/progress');

  return response.data;
}

async function readRegionList() {
  const response = await axiosInstance.get('/api/place/regions');

  return response.data;
}

async function readRecentLearningPlaces() {
  const response = await axiosInstance.get('/api/users/profile/recentLearningPlaces');

  return response.data;
}

export const placeService = {
  fetchPlaceTabs,
  fetchRoutes,
  readPlaceDetail,
  readPlaceMarkers,
  startLearningSession,
  startMissionSession,
  sendChatMessage,
  completeMissionSession,
  readMyLearningProgress,
  readRegionList,
  readRecentLearningPlaces
};
