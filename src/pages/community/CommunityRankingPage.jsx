import { useNavigate } from 'react-router-dom';
import {
  MapingoMetricGrid,
  MapingoPageSection,
} from '../../components/MapingoPageBlocks';
import { communityService } from '../../api/user/communityService';

function CommunityRankingPage() {
  const navigate = useNavigate();
  const rankingList = communityService.fetchRankingList();
  const friendComparisonList = communityService.fetchFriendComparison();
  const myRanking = rankingList.find((item) => item.name === 'Mapingo Learner');
  const topFriend = friendComparisonList.reduce((best, current) =>
    current.score > best.score ? current : best,
  );
  const averageFriendScore = Math.round(
    friendComparisonList.reduce((sum, friend) => sum + friend.score, 0) /
      friendComparisonList.length,
  );

  const rankingStats = [
    {
      label: '내 현재 순위',
      value: myRanking ? `${myRanking.rank}위` : '-',
      hint: myRanking ? `전체 사용자 중 ${myRanking.score}점` : '순위 정보 없음',
    },
    {
      label: '가장 높은 친구 점수',
      value: `${topFriend.name} ${topFriend.score}점`,
      hint: `${topFriend.streak}일 연속 학습 중`,
    },
    {
      label: '친구 평균 점수',
      value: `${averageFriendScore}점`,
      hint: '친구 비교 카드에서 자세히 볼 수 있어요',
    },
  ];

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="커뮤니티"
        title="점수 비교 · 랭킹"
        description="주간 랭킹과 비교 점수를 별도 화면에서 더 깔끔하게 볼 수 있어요."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/community')}>
            커뮤니티 메인으로
          </button>
        </div>
      </MapingoPageSection>

      <section className="mapingo-page-section">
        <MapingoMetricGrid items={rankingStats} />
      </section>

      <section className="mapingo-page-section">
        <div className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>친구 점수 비교</h3>
            <span className="mapingo-muted-copy">가까운 학습 흐름을 바로 확인</span>
          </div>

          <div className="mapingo-selectable-list">
            {friendComparisonList.map((friend) => (
              <article key={friend.id} className="mapingo-select-item mapingo-static-card">
                <div>
                  <strong>{friend.name}</strong>
                  <p>{`${friend.focus} 집중 중 · ${friend.streak}일 연속 학습`}</p>
                </div>
                <span className="mapingo-list-meta">{friend.score}점</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mapingo-page-section">
        <div className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>주간 랭킹</h3>
            <span className="mapingo-muted-copy">내 순위와 전체 흐름을 한 번에 확인</span>
          </div>

          <div className="mapingo-selectable-list">
            {rankingList.map((item) => (
              <article
                key={item.id}
                className={`mapingo-select-item mapingo-static-card ${
                  item.name === 'Mapingo Learner' ? 'is-active' : ''
                }`}
              >
                <div>
                  <strong>{`${item.rank}위 · ${item.name}`}</strong>
                  <p>
                    {item.name === 'Mapingo Learner'
                      ? '현재 내 위치'
                      : '이번 주 누적 학습 점수'}
                  </p>
                </div>
                <span className="mapingo-list-meta">{item.score}점</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CommunityRankingPage;
