import axiosInstance from '../axiosInstance';

async function readScenarios(keyword = '') {
  const response = await axiosInstance.get('/api/admin/scenarios', {
    params: { keyword },
  });

  return response.data;
}

async function readScenarioDetail(scenarioId) {
  const response = await axiosInstance.get(`/api/admin/scenarios/${scenarioId}`);
  return response.data;
}

async function createScenario(request) {
  await axiosInstance.post('/api/admin/scenarios', request);
}

async function updateScenario(scenarioId, request) {
  await axiosInstance.patch(`/api/admin/scenarios/${scenarioId}`, request);
}

async function deleteScenario(scenarioId) {
  await axiosInstance.delete(`/api/admin/scenarios/${scenarioId}`);
}

export const adminScenarioService = {
  readScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  readScenarioDetail
};