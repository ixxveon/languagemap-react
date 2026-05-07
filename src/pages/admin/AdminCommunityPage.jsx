import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminService } from '../../api/admin/adminService';
import AdminLearningGoalPage from './AdminLearningGoalPage';
import AdminFriendPage from './AdminFriendPage';
import '../../styles/admin/AdminCommunityPage.css';

const communityTabs = [
  {
    id: 'goals',
    label: '목표 관리',
    kicker: '학습 관리',
    description: '사용자가 선택할 수 있는 학습 목표를 등록하고 수정하며 상태를 관리합니다.',
  },
  {
    id: 'friends',
    label: '친구 관리',
    kicker: '\uC18C\uC15C \uAD00\uB9AC',
    description: '친구 차단/거절 이력과 소셜 신고 관련 데이터를 확인합니다.',
  },
  {
    id: 'ranking',
    label: '랭킹 관리',
    kicker: '순위 확인',
    description: '전체 랭킹과 주간 랭킹 리스트를 구분해 조회합니다.',
  },
];

const rankingScopeOptions = [
  { id: 'overall', label: '전체랭킹' },
  { id: 'weekly', label: '주간랭킹' },
];

function includesSearch(fields, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return fields.join(' ').toLowerCase().includes(normalizedQuery);
}

function AdminCommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const panelParam = searchParams.get('panel');
  const activePanel = communityTabs.some((tab) => tab.id === panelParam) ? panelParam : null;

  const [ranking] = useState(() => adminService.fetchAdminCommunityRanking());

  const [rankingSearch, setRankingSearch] = useState('');
  const [rankingScope, setRankingScope] = useState('overall');

  const activeTab = communityTabs.find((tab) => tab.id === activePanel);

  const weeklyRanking = useMemo(
    () =>
      ranking
        .map((item, index) => ({
          ...item,
          score: Math.max(0, Math.round(item.score * 0.18) + (ranking.length - index) * 12),
        }))
        .sort((left, right) => right.score - left.score)
        .map((item, index) => ({ ...item, rank: index + 1 })),
    [ranking],
  );

  const rankingList = rankingScope === 'weekly' ? weeklyRanking : ranking;

  const filteredRanking = useMemo(
    () =>
      rankingList
        .filter((item) => includesSearch([item.name, String(item.score), String(item.rank)], rankingSearch))
        .sort((left, right) => left.rank - right.rank),
    [rankingList, rankingSearch],
  );

  const handlePanelSelect = (panel) => {
    setSearchParams({ panel });
  };

  const handlePanelBack = () => {
    setSearchParams({});
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="커뮤니티 관리"
        description="목표, 친구, 랭킹을 관리자 화면 안에서 조회하고 운영 처리합니다."
      />

      {!activePanel ? (
        <section className="mapingo-page-section">
          <div className="mapingo-domain-entry-grid admin-entry-grid admin-community-entry-grid">
            {communityTabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className="mapingo-domain-entry-card admin-entry-card admin-community-entry-card"
                onClick={() => handlePanelSelect(tab.id)}
              >
                <div className="community-entry-card-top">
                  <span className="community-entry-accent">{tab.kicker}</span>
                  <span className="community-entry-index">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className="community-entry-card-body">
                  <h3>{tab.label}</h3>
                  <p>{tab.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {activePanel ? (
        <section className="mapingo-page-section">
          <div className="mapingo-card-header-row admin-result-head admin-community-panel-head">
            <div>
              <p className="mapingo-eyebrow">Community Admin</p>
              <h3>{activeTab?.label}</h3>
              <p className="mapingo-muted-copy">{activeTab?.description}</p>
            </div>

            <button
              type="button"
              className="mapingo-ghost-button admin-community-action-button"
              aria-label={'\ucee4\ubba4\ub2c8\ud2f0 \uba54\uc778\uc73c\ub85c'}
              title={'\ucee4\ubba4\ub2c8\ud2f0 \uba54\uc778\uc73c\ub85c'}
              onClick={handlePanelBack}
            >
              커뮤니티 관리
            </button>
          </div>
        </section>
      ) : null}

      {activePanel === 'goals' ? <AdminLearningGoalPage /> : null}

      {activePanel === 'friends' ? <AdminFriendPage /> : null}

      {activePanel === 'ranking' ? (
        <section className="mapingo-page-section">
          <div className="mapingo-list-card admin-ranking-panel">
            <div className="mapingo-card-header-row admin-result-head">
              <div>
                <h3>랭킹 리스트 조회</h3>
                <p className="mapingo-muted-copy">전체랭킹과 주간랭킹을 구분해서 확인합니다.</p>
              </div>

              <span className="mapingo-inline-badge">{filteredRanking.length}명</span>
            </div>

            <div className="admin-ranking-toolbar">
              <div className="admin-content-tags admin-ranking-tags">
                <span>전체 사용자 수 {ranking.length}명</span>
                <span>{rankingScope === 'weekly' ? '주간랭킹' : '전체랭킹'}</span>
              </div>

              <div className="mapingo-admin-action-row admin-ranking-toggle">
                {rankingScopeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={rankingScope === option.id ? 'mapingo-submit-button' : 'mapingo-ghost-button'}
                    onClick={() => setRankingScope(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <input
                className="mapingo-input admin-notice-search admin-ranking-search"
                type="search"
                value={rankingSearch}
                onChange={(event) => setRankingSearch(event.target.value)}
                placeholder="이름, 점수 검색"
              />
            </div>

            <div className="admin-entity-stack admin-growth-stack admin-ranking-list">
              {filteredRanking.map((item) => (
                <article key={item.id} className="mapingo-post-card admin-content-card admin-ranking-card">
                  <div className="mapingo-admin-item-head">
                    <div>
                      <strong>
                        {item.rank}위 · {item.name}
                      </strong>
                      <p>{rankingScope === 'weekly' ? '주간 랭킹' : '전체 랭킹'}</p>
                    </div>

                    <span className="mapingo-inline-badge">{item.score.toLocaleString('ko-KR')}점</span>
                  </div>
                </article>
              ))}

              {filteredRanking.length === 0 ? (
                <div className="admin-content-empty-state">랭킹 결과가 없습니다.</div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default AdminCommunityPage;
