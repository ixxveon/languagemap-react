import axiosInstance from '../axiosInstance';

const unwrapData = (response) => response.data?.data ?? response.data;

export const favoriteService = {

  fetchFavoritePlaces(userId) {
    return axiosInstance
      .get('/api/favorites/places', {
        params: { userId },
      })
      .then(unwrapData);
  },

  addFavoritePlace({ userId, placeId }) {
    return axiosInstance
      .post('/api/favorites/places', {
        userId,
        placeId,
      })
      .then(unwrapData);
  },

  removeFavoritePlace({ userId, placeId }) {
    return axiosInstance
      .delete('/api/favorites/places', {
        data: {
          userId,
          placeId,
        },
      })
      .then(unwrapData);
  },

  fetchFavoriteScenarios(userId) {
    return axiosInstance
      .get('/api/favorites/scenarios', {
        params: { userId },
      })
      .then(unwrapData);
  },

  addFavoriteScenario({ userId, scenarioId }) {
    return axiosInstance
      .post('/api/favorites/scenarios', {
        userId,
        scenarioId,
      })
      .then(unwrapData);
  },

  removeFavoriteScenario({ userId, scenarioId }) {
    return axiosInstance
      .delete('/api/favorites/scenarios', {
        data: {
          userId,
          scenarioId,
        },
      })
      .then(unwrapData);
  },
};