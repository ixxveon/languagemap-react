import axiosInstance from '../axiosInstance';

async function readPlaces(keyword = '') {
    const response = await axiosInstance.get('/api/admin/places', {
        params: { keyword },
    });

    return response.data;
}

async function readPlaceDetail(placeId) {
    const response = await axiosInstance.get(`/api/admin/places/${placeId}`);

    return response.data;
}

async function createPlace(request) {
    await axiosInstance.post('/api/admin/places', request);
}

async function updatePlace(placeId, request) {
    await axiosInstance.patch(`/api/admin/places/${placeId}`, request);
}

async function deletePlace(placeId) {
    await axiosInstance.delete(`/api/admin/places/${placeId}`);
}

export const adminPlaceService = {
    readPlaces,
    readPlaceDetail,
    createPlace,
    updatePlace,
    deletePlace,
};