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

async function startMissionSession(sessionId, missionId) {
  const response = await axiosInstance.patch(
    `/api/place/learningSessions/${sessionId}/missions/${missionId}`
  );

  return response.data;
}

async function sendChatMessage(request) {
  const response = await axiosInstance.post('/api/place/chat', request);

  return response.data;
}

async function completeMissionSession(sessionId, missionId) {
  const response = await axiosInstance.patch(
    `/api/place/missionSessions/${sessionId}/missions/${missionId}`
  );

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
  completeMissionSession
};
