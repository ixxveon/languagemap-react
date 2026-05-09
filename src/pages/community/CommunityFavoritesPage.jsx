import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { useCommunityFavorites } from '../../hooks/community/useCommunityFavorites';
import '../../styles/user/CommunityFavoritesPage.css';

function FavoriteCard({ title, description, metaChips, subCopy, onRemove }) {
  return (
    <article className="community-favorites-favorite-card">
      <div className="community-favorites-favorite-head">
        <div className="community-favorites-route-copy">
          <h4 className="community-favorites-route-heading">{title}</h4>
          <p className="community-favorites-route-description">{description}</p>

          <div className="community-favorites-chip-row">
            {metaChips.map((chip, index) => (
              <span key={`${title}-${chip}-${index}`} className="community-favorites-chip is-progress">
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
  const {
    favoritePlaces,
    favoriteScenarios,
    isLoading,
    errorMessage,
    formatDate,
    handleRemoveFavoritePlace,
    handleRemoveFavoriteScenario,
  } = useCommunityFavorites();

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="커뮤니티"
        title="즐겨찾기를 관리해보세요"
        description="자주 학습하는 장소와 다시 보고 싶은 시나리오를 한 화면에서 확인할 수 있어요."
      />

      <section className="mapingo-page-section">
        {isLoading && <div className="community-favorites-route-list-empty">불러오는 중...</div>}

        {errorMessage && (
          <div className="community-favorites-route-list-empty">{errorMessage}</div>
        )}

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
                    key={place.favoritePlaceId}
                    title={place.title}
                    description={place.description}
                    metaChips={[place.category, place.difficulty].filter(Boolean)}
                    subCopy={`등록일 ${formatDate(place.createdAt)}`}
                    onRemove={() => handleRemoveFavoritePlace(place.placeId)}
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
                    key={scenario.favoriteScenarioId}
                    title={scenario.title}
                    description={scenario.summary}
                    metaChips={[scenario.category, scenario.difficulty].filter(Boolean)}
                    subCopy={`등록일 ${formatDate(scenario.createdAt)}`}
                    onRemove={() => handleRemoveFavoriteScenario(scenario.scenarioId)}
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