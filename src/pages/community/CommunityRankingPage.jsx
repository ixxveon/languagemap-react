import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapingoMetricGrid,
  MapingoPageSection,
} from "../../components/MapingoPageBlocks";
import { useRanking } from "../../hooks/community/useRanking";

function CommunityRankingPage() {
  const navigate = useNavigate();

  const {
    rankingList,
    friendComparisonList,
    myRanking,
    totalUserCount,
    rankingStats,
    isLoading,
    errorMessage,
  } = useRanking();

  const displayRankingList = useMemo(() => {
    if (!myRanking) {
      return rankingList;
    }

    const myItem = rankingList.find(
      (item) => Number(item.userId) === Number(myRanking.userId),
    );

    if (!myItem) {
      return rankingList;
    }

    return [myItem, ...rankingList.filter((item) => Number(item.userId) !== Number(myRanking.userId))];
  }, [myRanking, rankingList]);

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="커뮤니티"
        title="점수 비교와 랭킹"
        description="주간 랭킹과 친구 비교 점수를 백엔드 데이터로 확인해보세요."
      >
        <div className="mapingo-page-actions">
          <button
            type="button"
            className="mapingo-ghost-button"
            onClick={() => navigate("/community")}
          >
            커뮤니티 메인으로
          </button>
        </div>
      </MapingoPageSection>

      {isLoading ? (
        <section className="mapingo-page-section">
          <div className="mapingo-list-card">
            <div className="admin-content-empty-state">
              랭킹 정보를 불러오는 중입니다.
            </div>
          </div>
        </section>
      ) : null}

      {!isLoading && errorMessage ? (
        <section className="mapingo-page-section">
          <div className="mapingo-list-card">
            <div className="admin-content-empty-state">{errorMessage}</div>
          </div>
        </section>
      ) : null}

      {!isLoading && !errorMessage ? (
        <>
          <section className="mapingo-page-section">
            <MapingoMetricGrid items={rankingStats} />
          </section>

          <section className="mapingo-page-section">
            <div className="mapingo-list-card">
              <div className="mapingo-card-header-row">
                <h3>친구 점수 비교</h3>
                <span className="mapingo-muted-copy">
                  가까운 학습 흐름을 바로 확인
                </span>
              </div>

              <div className="mapingo-selectable-list">
                {friendComparisonList.map((friend) => (
                  <article
                    key={friend.id}
                    className="mapingo-select-item mapingo-static-card"
                  >
                    <div>
                      <strong>{friend.name}</strong>
                      <p>이번 주 학습 점수</p>
                    </div>
                    <span className="mapingo-list-meta">{friend.score}점</span>
                  </article>
                ))}

                {friendComparisonList.length === 0 ? (
                  <div className="admin-content-empty-state">
                    친구 랭킹 정보가 없습니다.
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="mapingo-page-section">
            <div className="mapingo-list-card">
              <div className="mapingo-card-header-row">
                <div>
                  <h3>주간 랭킹</h3>
                  <span className="mapingo-muted-copy">
                    내 순위와 전체 흐름을 한 번에 확인
                  </span>
                </div>

                <span className="mapingo-inline-badge">
                  전체 사용자 {totalUserCount}명
                </span>
              </div>

              <div className="mapingo-selectable-list">
                {displayRankingList.map((item) => (
                  <article
                    key={item.id}
                    className={`mapingo-select-item mapingo-static-card ${
                      myRanking && Number(item.userId) === Number(myRanking.userId) ? "is-active" : ""
                    }`}
                  >
                    <div>
                      <strong>{`${item.rank}위 · ${item.name}`}</strong>
                      <p>
                        {myRanking && Number(item.userId) === Number(myRanking.userId)
                          ? "현재 내 위치"
                          : "이번 주 누적 학습 점수"}
                      </p>
                    </div>
                    <span className="mapingo-list-meta">{item.score}점</span>
                  </article>
                ))}

                {displayRankingList.length === 0 ? (
                  <div className="admin-content-empty-state">
                    주간 랭킹 정보가 없습니다.
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

export default CommunityRankingPage;
