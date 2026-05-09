import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapingoMetricGrid,
  MapingoPageSection,
} from '../../components/MapingoPageBlocks';
import { communityService } from '../../api/user/communityService';

const getResponseData = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  return [];
};

const normalizeRanking = (item, index) => ({
  id: item.id ?? item.userId ?? item.user_id ?? index + 1,
  userId: item.userId ?? item.user_id,
  name: item.name ?? item.userName ?? item.nickname ?? `USER ${item.userId ?? index + 1}`,
  score: item.score ?? item.totalScore ?? item.weeklyScore ?? 0,
  rank: item.rank ?? index + 1,
});

const normalizeFriendScore = (item, index) => ({
  id: item.id ?? item.userId ?? item.user_id ?? index + 1,
  name: item.name ?? item.userName ?? item.nickname ?? `USER ${item.userId ?? index + 1}`,
  score: item.score ?? item.totalScore ?? item.weeklyScore ?? 0,
  streak: item.streak ?? item.streakDays ?? 0,
  focus: item.focus ?? item.goalText ?? item.learningGoal ?? '학습',
});

function CommunityRankingPage() {
  const navigate = useNavigate();
  const currentUserId = Number(localStorage.getItem('userId')) || 1;
  const [rankingList, setRankingList] = useState([]);
  const [friendComparisonList, setFriendComparisonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadRankingData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [rankings, friendScores] = await Promise.all([
          communityService.fetchRankingList(),
          communityService.fetchFriendComparison(currentUserId),
        ]);

        setRankingList(getResponseData(rankings).map(normalizeRanking));
        setFriendComparisonList(getResponseData(friendScores).map(normalizeFriendScore));
      } catch (error) {
        console.error(error);
        setRankingList([]);
        setFriendComparisonList([]);
        setErrorMessage('랭킹 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRankingData();
  }, [currentUserId]);

  const myRanking = useMemo(
    () => rankingList.find((item) => item.userId === currentUserId) ?? null,
    [currentUserId, rankingList],
  );

  const topFriend = useMemo(
    () =>
      friendComparisonList.reduce(
        (best, current) => (current.score > best.score ? current : best),
        friendComparisonList[0] ?? null,
      ),
    [friendComparisonList],
  );

  const averageFriendScore = friendComparisonList.length
    ? Math.round(
        friendComparisonList.reduce((sum, friend) => sum + friend.score, 0) /
          friendComparisonList.length,
      )
    : 0;

  const rankingStats = [
    {
      label: '현재 순위',
      value: myRanking ? `${myRanking.rank}위` : '-',
      hint: myRanking ? `전체 사용자 중 ${myRanking.score}점` : '내 순위 정보가 없어요',
    },
    {
      label: '가장 높은 친구 점수',
      value: topFriend ? `${topFriend.name} ${topFriend.score}점` : '-',
      hint: topFriend ? `${topFriend.streak}일 연속 학습 중` : '친구 점수 정보가 없어요',
    },
    {
      label: '친구 평균 점수',
      value: friendComparisonList.length ? `${averageFriendScore}점` : '-',
      hint: '친구 비교 카드에서 자세히 볼 수 있어요',
    },
  ];

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="커뮤니티"
        title="점수 비교와 랭킹"
        description="주간 랭킹과 친구 비교 점수를 백엔드 데이터로 확인해보세요."
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

      {errorMessage ? (
        <section className="mapingo-page-section">
          <div className="community-friends-empty-card">{errorMessage}</div>
        </section>
      ) : null}

      <section className="mapingo-page-section">
        <div className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>친구 점수 비교</h3>
            <span className="mapingo-muted-copy">가까운 학습 흐름을 바로 확인</span>
          </div>

          {friendComparisonList.length === 0 ? (
            <div className="community-friends-empty-card">
              {isLoading ? '친구 점수를 불러오는 중이에요.' : '비교할 친구 점수가 없어요.'}
            </div>
          ) : (
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
          )}
        </div>
      </section>

      <section className="mapingo-page-section">
        <div className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>주간 랭킹</h3>
            <span className="mapingo-muted-copy">내 순위와 전체 흐름을 한 번에 확인</span>
          </div>

          {rankingList.length === 0 ? (
            <div className="community-friends-empty-card">
              {isLoading ? '랭킹을 불러오는 중이에요.' : '랭킹 정보가 없어요.'}
            </div>
          ) : (
            <div className="mapingo-selectable-list">
              {rankingList.map((item) => (
                <article
                  key={item.id}
                  className={`mapingo-select-item mapingo-static-card ${
                    item.userId === currentUserId ? 'is-active' : ''
                  }`}
                >
                  <div>
                    <strong>{`${item.rank}위 · ${item.name}`}</strong>
                    <p>{item.userId === currentUserId ? '현재 내 위치' : '이번 주 누적 학습 점수'}</p>
                  </div>
                  <span className="mapingo-list-meta">{item.score}점</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CommunityRankingPage;
