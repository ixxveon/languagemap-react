import { useEffect, useMemo, useState } from 'react';
import { favoriteService } from '../../api/user/favoriteService';
import { placeService } from '../../api/place/placeService';

const USER_ID = 1;

const routeRows = placeService.fetchRoutes();

const placeCatalogRows = routeRows.map((route, index) => ({
    placeId: index + 1,
    title: route.title,
    category: route.category,
    difficulty: route.difficulty,
    duration: route.duration,
    description: route.description,
}));

const scenarioCatalogRows = routeRows.map((route, index) => ({
    scenarioId: index + 1,
    title: `${route.title} 추천 시나리오`,
    category: route.category,
    difficulty: route.difficulty,
    summary: route.scenario,
}));

function formatDate(dateString) {
    if (!dateString) {
        return '';
    }

    const [date] = dateString.includes('T') ? dateString.split('T') : dateString.split(' ');
    return date.replaceAll('-', '.');
}

export function useCommunityFavorites() {
    const [favoritePlaceRows, setFavoritePlaceRows] = useState([]);
    const [favoriteScenarioRows, setFavoriteScenarioRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchFavorites = async () => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            const [places, scenarios] = await Promise.all([
                favoriteService.fetchFavoritePlaces(USER_ID),
                favoriteService.fetchFavoriteScenarios(USER_ID),
            ]);

            setFavoritePlaceRows(places ?? []);
            setFavoriteScenarioRows(scenarios ?? []);
        } catch (error) {
            console.error(error);
            setErrorMessage('즐겨찾기 목록을 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const favoritePlaces = useMemo(
        () =>
            favoritePlaceRows.map((favorite) => {
                const placeInfo = placeCatalogRows.find((place) => place.placeId === favorite.placeId);

                return {
                    ...favorite,
                    title: placeInfo?.title ?? `장소 #${favorite.placeId}`,
                    description: placeInfo?.description ?? '장소 상세 정보가 없습니다.',
                    category: placeInfo?.category ?? '',
                    difficulty: placeInfo?.difficulty ?? '',
                };
            }),
        [favoritePlaceRows],
    );

    const favoriteScenarios = useMemo(
        () =>
            favoriteScenarioRows.map((favorite) => {
                const scenarioInfo = scenarioCatalogRows.find(
                    (scenario) => scenario.scenarioId === favorite.scenarioId,
                );

                return {
                    ...favorite,
                    title: scenarioInfo?.title ?? `시나리오 #${favorite.scenarioId}`,
                    summary: scenarioInfo?.summary ?? '시나리오 상세 정보가 없습니다.',
                    category: scenarioInfo?.category ?? '',
                    difficulty: scenarioInfo?.difficulty ?? '',
                };
            }),
        [favoriteScenarioRows],
    );

    const handleRemoveFavoritePlace = async (placeId) => {
        try {
            setErrorMessage('');

            await favoriteService.removeFavoritePlace({
                userId: USER_ID,
                placeId,
            });

            setFavoritePlaceRows((current) => current.filter((favorite) => favorite.placeId !== placeId));
        } catch (error) {
            console.error(error);
            setErrorMessage('장소 즐겨찾기 해제에 실패했습니다.');
        }
    };

    const handleRemoveFavoriteScenario = async (scenarioId) => {
        try {
            setErrorMessage('');

            await favoriteService.removeFavoriteScenario({
                userId: USER_ID,
                scenarioId,
            });

            setFavoriteScenarioRows((current) =>
                current.filter((favorite) => favorite.scenarioId !== scenarioId),
            );
        } catch (error) {
            console.error(error);
            setErrorMessage('시나리오 즐겨찾기 해제에 실패했습니다.');
        }
    };

    return {
        favoritePlaces,
        favoriteScenarios,
        isLoading,
        errorMessage,
        formatDate,
        fetchFavorites,
        handleRemoveFavoritePlace,
        handleRemoveFavoriteScenario,
    };
}