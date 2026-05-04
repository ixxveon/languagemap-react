import { placeTabOptions, routeCatalog } from '../../mocks/user/placeMockData';

function fetchPlaceTabs() {
  return placeTabOptions;
}

function fetchRoutes() {
  return routeCatalog;
}

export const placeService = {
  fetchPlaceTabs,
  fetchRoutes,
};
