import axiosInstance from '../axiosInstance';

async function readRegions(keyword = '') {
  const response = await axiosInstance.get('/api/admin/regions', {
    params: { keyword },
  });

  return response.data;
}

async function readRegionDetail(regionId) {
  const response = await axiosInstance.get(`/api/admin/regions/${regionId}`);

  return response.data;
}

async function createRegion(request) {
  await axiosInstance.post('/api/admin/regions', request);
}

async function updateRegion(regionId, request) {
  await axiosInstance.patch(`/api/admin/regions/${regionId}`, request);
}

async function deleteRegion(regionId) {
  await axiosInstance.delete(`/api/admin/regions/${regionId}`);
}

export const adminRegionService = {
  readRegions,
  readRegionDetail,
  createRegion,
  updateRegion,
  deleteRegion,
};