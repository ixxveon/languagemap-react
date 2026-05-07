import { useMemo, useState } from 'react';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { placeService } from '../../api/user/placeService';
import '../../styles/user/CommunityFavoritesPage.css';

const routeRows = placeService.fetchRoutes();

const placeCatalogRows = routeRows.map((route, index) => ({
  place_id: index + 101,
  title: route.title,
  category: route.category,
  difficulty: route.difficulty,
  duration: route.duration,
  description: route.description,
}));

const scenarioCatalogRows = routeRows.map((route, index) => ({
  scenario_id: index + 201,
  title: `${route.title} 추천 시나리오`,
  category: route.category,
  difficulty: route.difficulty,
  summary: route.scenario,
}));

const initialFavoritePlaceRows = [
  {
    favorite_place_id: 1,
    user_id: 1,
    place_id: 101,
    created_at: '2026-04-18 12:10:00',
  },
  {
    favorite_place_id: 2,
    user_id: 1,
    place_id: 103,
    created_at: '2026-04-19 18:40:00',
  },
];

const initialFavoriteScenarioRows = [
  {
    favorite_expression_id: 1,
    user_id: 1,
    scenario_id: 201,
    created_at: '2026-04-18 12:15:00',
  },
  {
    favorite_expression_id: 2,
    user_id: 1,
    scenario_id: 204,
    created_at: '2026-04-20 09:30:00',
  },
];

function formatDate(dateString) {
  const [date] = dateString.split(' ');
  return date.replaceAll('-', '.');
}

function FavoriteCard({ title, description, metaChips, subCopy, onRemove }) {
  return (
    <article className="community-favorites-favorite-card">
      <div className="community-favorites-favorite-head">
        <div className="community-favorites-route-copy">
          <h4 className="community-favorites-route-heading">{title}</h4>
          <p className="community-favorites-route-description">{description}</p>

          <div className="community-favorites-chip-row">
            {metaChips.map((chip) => (
              <span key={`${title}-${chip}`} className="community-favorites-chip is-progress">
                {chip}
              </span>
            ))}
          </div>

          <small className="community-favorites-favorite-meta">{subCopy}</small>
        </div>

        <button type="button" className="community-favorites-danger-button" onClick={onRemove}>
          즐겨찾기 해제
        </button>
      </div>
    </article>
  );
}

export default function CommunityFavoritesPage() {
  const [favoritePlaceRows, setFavoritePlaceRows] = useState(initialFavoritePlaceRows);
  const [favoriteScenarioRows, setFavoriteScenarioRows] = useState(initialFavoriteScenarioRows);

  const favoritePlaces = useMemo(
    () =>
      favoritePlaceRows
        .map((favorite) => ({
          ...favorite,
          ...placeCatalogRows.find((place) => place.place_id === favorite.place_id),
        }))
        .filter((place) => place.place_id),
    [favoritePlaceRows],
  );

  const favoriteScenarios = useMemo(
    () =>
      favoriteScenarioRows
        .map((favorite) => ({
          ...favorite,
          ...scenarioCatalogRows.find((scenario) => scenario.scenario_id === favorite.scenario_id),
        }))
        .filter((scenario) => scenario.scenario_id),
    [favoriteScenarioRows],
  );

  const handleRemoveFavoritePlace = (favoritePlaceId) => {
    setFavoritePlaceRows((current) =>
      current.filter((favorite) => favorite.favorite_place_id !== favoritePlaceId),
    );
  };

  const handleRemoveFavoriteScenario = (favoriteExpressionId) => {
    setFavoriteScenarioRows((current) =>
      current.filter((favorite) => favorite.favorite_expression_id !== favoriteExpressionId),
    );
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="커뮤니티"
        title="즐겨찾기를 관리해보세요"
        description="자주 학습하는 장소와 다시 보고 싶은 시나리오를 한 화면에서 확인할 수 있어요."
      />

      <section className="mapingo-page-section">
        <div className="community-favorites-favorites-grid">
          <div className="mapingo-list-card">
            <div className="mapingo-card-header-row">
              <h3>즐겨찾기 장소</h3>
              <span className="mapingo-muted-copy">자주 가는 장소 모아보기</span>
            </div>

            <div className="community-favorites-route-list">
              {favoritePlaces.length === 0 ? (
                <div className="community-favorites-route-list-empty">
                  저장한 장소 즐겨찾기가 없어요.
                </div>
              ) : (
                favoritePlaces.map((place) => (
                  <FavoriteCard
                    key={place.favorite_place_id}
                    title={place.title}
                    description={place.description}
                    metaChips={[place.category, place.difficulty]}
                    subCopy={`등록일 ${formatDate(place.created_at)}`}
                    onRemove={() => handleRemoveFavoritePlace(place.favorite_place_id)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="mapingo-list-card">
            <div className="mapingo-card-header-row">
              <h3>즐겨찾기 시나리오</h3>
              <span className="mapingo-muted-copy">다시 보고 싶은 대화 모아보기</span>
            </div>

            <div className="community-favorites-route-list">
              {favoriteScenarios.length === 0 ? (
                <div className="community-favorites-route-list-empty">
                  저장한 시나리오 즐겨찾기가 없어요.
                </div>
              ) : (
                favoriteScenarios.map((scenario) => (
                  <FavoriteCard
                    key={scenario.favorite_expression_id}
                    title={scenario.title}
                    description={scenario.summary}
                    metaChips={[scenario.category, scenario.difficulty]}
                    subCopy={`등록일 ${formatDate(scenario.created_at)}`}
                    onRemove={() => handleRemoveFavoriteScenario(scenario.favorite_expression_id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}