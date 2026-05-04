import { useMemo, useState } from 'react';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { placeService } from '../../api/placeService';
import '../../styles/CommunityFavoritesPage.css';

const MAX_ACTIVE_GOALS = 3;
const INITIAL_AVAILABLE_GOAL_COUNT = 2;
const GOAL_PAGE_SIZE = 2;
const TODAY = '2026-04-21';

const goalMasterRows = [
  {
    goal_master_id: 1,
    badge_id: 3,
    goal_type: 'STUDY_COUNT',
    goal_title: '이번 주 학습 5회 채우기',
    goal_description: '주간 학습 루틴을 안정적으로 만드는 기본 목표예요.',
    target_value: 5,
    period_type: 'WEEKLY',
    is_active: true,
    display_order: 1,
  },
  {
    goal_master_id: 2,
    badge_id: 4,
    goal_type: 'PRONUNCIATION_SCORE',
    goal_title: '발음 점수 85점 달성',
    goal_description: '발음 리뷰 결과를 끌어올리는 집중형 목표예요.',
    target_value: 85,
    period_type: 'WEEKLY',
    is_active: true,
    display_order: 2,
  },
  {
    goal_master_id: 3,
    badge_id: 2,
    goal_type: 'SPEAKING_COUNT',
    goal_title: '말하기 연습 3회 완료',
    goal_description: '짧아도 꾸준히 말하기 세션을 이어가는 목표예요.',
    target_value: 3,
    period_type: 'WEEKLY',
    is_active: true,
    display_order: 3,
  },
  {
    goal_master_id: 4,
    badge_id: 1,
    goal_type: 'STUDY_TIME',
    goal_title: '학습 시간 60분 누적',
    goal_description: '짧은 세션을 모아 이번 주 60분을 채워보세요.',
    target_value: 60,
    period_type: 'WEEKLY',
    is_active: true,
    display_order: 4,
  },
  {
    goal_master_id: 5,
    badge_id: 3,
    goal_type: 'STUDY_COUNT',
    goal_title: '연속 3일 학습 유지',
    goal_description: '학습을 끊기지 않게 이어가는 루틴형 목표예요.',
    target_value: 3,
    period_type: 'DAILY',
    is_active: true,
    display_order: 5,
  },
  {
    goal_master_id: 6,
    badge_id: 2,
    goal_type: 'SPEAKING_COUNT',
    goal_title: '자유 말하기 5문장 기록',
    goal_description: '오늘의 표현을 직접 문장으로 말해보는 도전이에요.',
    target_value: 5,
    period_type: 'WEEKLY',
    is_active: true,
    display_order: 6,
  },
];

const initialUserGoalRows = [
  {
    user_goal_id: 1,
    user_id: 1,
    goal_master_id: 1,
    current_value: 3,
    status: 'ACTIVE',
    start_date: '2026-04-21',
    end_date: '2026-04-27',
    completed_at: null,
  },
  {
    user_goal_id: 2,
    user_id: 1,
    goal_master_id: 2,
    current_value: 82,
    status: 'ACTIVE',
    start_date: '2026-04-21',
    end_date: '2026-04-27',
    completed_at: null,
  },
  {
    user_goal_id: 3,
    user_id: 1,
    goal_master_id: 5,
    current_value: 2,
    status: 'ACTIVE',
    start_date: '2026-04-21',
    end_date: '2026-04-21',
    completed_at: null,
  },
  {
    user_goal_id: 4,
    user_id: 1,
    goal_master_id: 3,
    current_value: 3,
    status: 'COMPLETED',
    start_date: '2026-04-14',
    end_date: '2026-04-20',
    completed_at: '2026-04-19 20:20:00',
  },
];

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

function getGoalTypeLabel(goalType) {
  if (goalType === 'STUDY_COUNT') return '학습 횟수';
  if (goalType === 'SPEAKING_COUNT') return '말하기 횟수';
  if (goalType === 'STUDY_TIME') return '학습 시간';
  if (goalType === 'PRONUNCIATION_SCORE') return '발음 점수';
  if (goalType === 'WEEKLY_GOAL') return '주간 목표';
  return goalType;
}

function getPeriodLabel(periodType) {
  if (periodType === 'DAILY') return '일간 목표';
  if (periodType === 'WEEKLY') return '주간 목표';
  if (periodType === 'MONTHLY') return '월간 목표';
  return '상시 목표';
}

function calculateGoalEndDate(periodType) {
  const baseDate = new Date(`${TODAY}T00:00:00`);

  if (periodType === 'DAILY') {
    return TODAY;
  }

  if (periodType === 'WEEKLY') {
    baseDate.setDate(baseDate.getDate() + 6);
    return baseDate.toISOString().slice(0, 10);
  }

  if (periodType === 'MONTHLY') {
    baseDate.setDate(baseDate.getDate() + 29);
    return baseDate.toISOString().slice(0, 10);
  }

  return null;
}

function StatusBadge({ label, tone = 'neutral' }) {
  return <span className={`community-favorites-status-badge is-${tone}`}>{label}</span>;
}

function GoalCard({ goal, onCancel }) {
  const progressPercent = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));

  return (
    <article className="community-favorites-goal-card">
      <div className="community-favorites-goal-head">
        <div>
          <div className="community-favorites-goal-title-row">
            <h4>{goal.goal_title}</h4>
            <StatusBadge
              label={goal.status === 'COMPLETED' ? '완료' : goal.status === 'ACTIVE' ? '진행 중' : '종료'}
              tone={goal.status === 'COMPLETED' ? 'success' : goal.status === 'ACTIVE' ? 'info' : 'muted'}
            />
          </div>
          <p className="community-favorites-goal-description">{goal.goal_description}</p>
        </div>
        {goal.status === 'ACTIVE' ? (
          <button
            type="button"
            className="community-favorites-danger-button"
            onClick={() => onCancel(goal.user_goal_id)}
          >
            목표 해제
          </button>
        ) : null}
      </div>

      <div className="community-favorites-chip-row">
        <span className="community-favorites-chip is-progress">{getPeriodLabel(goal.period_type)}</span>
        <span className="community-favorites-chip is-goal">{getGoalTypeLabel(goal.goal_type)}</span>
        <span className="community-favorites-chip is-goal">
          {goal.current_value} / {goal.target_value}
        </span>
      </div>

      <progress className="community-favorites-progress" value={progressPercent} max="100" />

      <div className="community-favorites-meta-row">
        <span>{`시작일 ${formatDate(goal.start_date)}`}</span>
        <span>{goal.end_date ? `종료일 ${formatDate(goal.end_date)}` : '상시 진행'}</span>
        {goal.completed_at ? <span>{`완료 ${formatDate(goal.completed_at)}`}</span> : null}
      </div>
    </article>
  );
}

function GoalMasterCard({ goal, disabled, onAdd }) {
  return (
    <article className="mapingo-select-item mapingo-static-card">
      <div className="community-favorites-route-main">
        <strong>{goal.goal_title}</strong>
        <p>{goal.goal_description}</p>
        <div className="community-favorites-chip-row">
          <span className="community-favorites-chip is-progress">{getPeriodLabel(goal.period_type)}</span>
          <span className="community-favorites-chip is-goal">{`목표값 ${goal.target_value}`}</span>
        </div>
      </div>

      <button
        type="button"
        className={`community-favorites-select-button ${disabled ? 'is-disabled' : ''}`}
        onClick={() => onAdd(goal.goal_master_id)}
        disabled={disabled}
      >
        {disabled ? '추가 불가' : '목표 추가'}
      </button>
    </article>
  );
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
  const [userGoalRows, setUserGoalRows] = useState(initialUserGoalRows);
  const [favoritePlaceRows, setFavoritePlaceRows] = useState(initialFavoritePlaceRows);
  const [favoriteScenarioRows, setFavoriteScenarioRows] = useState(initialFavoriteScenarioRows);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [visibleAvailableGoalCount, setVisibleAvailableGoalCount] = useState(INITIAL_AVAILABLE_GOAL_COUNT);

  const activeGoals = useMemo(
    () =>
      userGoalRows
        .filter((goal) => goal.status === 'ACTIVE')
        .map((goal) => ({
          ...goal,
          ...goalMasterRows.find((goalMaster) => goalMaster.goal_master_id === goal.goal_master_id),
        }))
        .slice(0, MAX_ACTIVE_GOALS),
    [userGoalRows],
  );

  const completedGoals = useMemo(
    () =>
      userGoalRows
        .filter((goal) => goal.status === 'COMPLETED')
        .map((goal) => ({
          ...goal,
          ...goalMasterRows.find((goalMaster) => goalMaster.goal_master_id === goal.goal_master_id),
        })),
    [userGoalRows],
  );

  const availableGoalMasters = useMemo(
    () =>
      goalMasterRows
        .filter((goal) => goal.is_active)
        .filter(
          (goal) => !activeGoals.some((activeGoal) => activeGoal.goal_master_id === goal.goal_master_id),
        )
        .sort((a, b) => a.display_order - b.display_order),
    [activeGoals],
  );

  const visibleAvailableGoalMasters = useMemo(
    () => availableGoalMasters.slice(0, visibleAvailableGoalCount),
    [availableGoalMasters, visibleAvailableGoalCount],
  );

  const hasMoreAvailableGoals = visibleAvailableGoalCount < availableGoalMasters.length;

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

  const handleAddGoal = (goalMasterId) => {
    if (activeGoals.length >= MAX_ACTIVE_GOALS) {
      setFeedbackMessage('진행 중 목표는 최대 3개까지만 유지할 수 있어요.');
      return;
    }

    const selectedGoal = goalMasterRows.find((goal) => goal.goal_master_id === goalMasterId);
    if (!selectedGoal) return;

    setUserGoalRows((current) => [
      {
        user_goal_id: current.length + 1,
        user_id: 1,
        goal_master_id: goalMasterId,
        current_value: 0,
        status: 'ACTIVE',
        start_date: TODAY,
        end_date: calculateGoalEndDate(selectedGoal.period_type),
        completed_at: null,
      },
      ...current,
    ]);
    setFeedbackMessage('');
  };

  const handleCancelGoal = (userGoalId) => {
    setUserGoalRows((current) =>
      current.map((goal) =>
        goal.user_goal_id === userGoalId
          ? {
              ...goal,
              status: 'CANCELED',
              end_date: TODAY,
            }
          : goal,
      ),
    );
    setFeedbackMessage('');
  };

  const handleShowMoreGoals = () => {
    setVisibleAvailableGoalCount((current) => current + GOAL_PAGE_SIZE);
  };

  const handleRemoveFavoritePlace = (favoritePlaceId) => {
    setFavoritePlaceRows((current) => current.filter((favorite) => favorite.favorite_place_id !== favoritePlaceId));
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
        title="목표와 즐겨찾기를 한 번에 관리해보세요"
        description="학습 현황, 진행 중인 목표와 저장한 항목들을 한 화면에서 확인할 수 있어요."
      />

      <section className="mapingo-page-section">
        <div className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>학습 목표</h3>
            <span className="mapingo-muted-copy">{`진행 중 ${activeGoals.length} / ${MAX_ACTIVE_GOALS}`}</span>
          </div>

          <p className="community-favorites-section-copy">
            원하는 목표를 골라서 최대 3개까지만 동시에 관리할 수 있어요.
          </p>

          <div className="community-favorites-goal-layout">
            <div className="community-favorites-column">
              <div className="community-favorites-subsection-head">
                <h4>진행 중인 목표</h4>
                <span>현재 집중하고 있는 목표</span>
              </div>

              {activeGoals.length === 0 ? (
                <div className="community-favorites-empty-card">아직 진행 중인 목표가 없어요.</div>
              ) : (
                <div className="community-favorites-goal-list">
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.user_goal_id} goal={goal} onCancel={handleCancelGoal} />
                  ))}
                </div>
              )}
            </div>

            <div className="community-favorites-column">
              <div className="community-favorites-subsection-head">
                <h4>추가 가능한 목표</h4>
                <span>원하는 목표를 골라 새로 시작해보세요</span>
              </div>

              {availableGoalMasters.length === 0 ? (
                <div className="community-favorites-empty-card">지금 추가 가능한 목표가 없어요.</div>
              ) : (
                <>
                  <div className="mapingo-selectable-list">
                    {visibleAvailableGoalMasters.map((goal) => (
                      <GoalMasterCard
                        key={goal.goal_master_id}
                        goal={goal}
                        disabled={activeGoals.length >= MAX_ACTIVE_GOALS}
                        onAdd={handleAddGoal}
                      />
                    ))}
                  </div>

                  {hasMoreAvailableGoals ? (
                    <button
                      type="button"
                      className="community-favorites-more-button"
                      onClick={handleShowMoreGoals}
                    >
                      목표 더보기
                    </button>
                  ) : null}
                </>
              )}

              <p className={`community-favorites-selection-message ${feedbackMessage ? 'is-error' : ''}`}>
                {feedbackMessage || '완료된 목표는 아래 완료 이력에서 다시 확인할 수 있어요.'}
              </p>
            </div>
          </div>

          <div className="community-favorites-history">
            <div className="community-favorites-subsection-head">
              <h4>완료된 목표</h4>
              <span>달성을 마친 목표 이력</span>
            </div>

            {completedGoals.length === 0 ? (
              <div className="community-favorites-empty-card">완료된 목표가 아직 없어요.</div>
            ) : (
              <div className="community-favorites-goal-list">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.user_goal_id} goal={goal} onCancel={handleCancelGoal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mapingo-page-section">
        <div className="community-favorites-favorites-grid">
          <div className="mapingo-list-card">
            <div className="mapingo-card-header-row">
              <h3>즐겨찾기 장소</h3>
              <span className="mapingo-muted-copy">자주 가는 장소 모아보기</span>
            </div>

            <div className="community-favorites-route-list">
              {favoritePlaces.length === 0 ? (
                <div className="community-favorites-route-list-empty">저장한 장소 즐겨찾기가 없어요.</div>
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
                <div className="community-favorites-route-list-empty">저장한 시나리오 즐겨찾기가 없어요.</div>
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
