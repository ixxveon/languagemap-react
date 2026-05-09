import { useRef } from 'react';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { useLearningGoals } from '../../hooks/community/useLearningGoals';
import '../../styles/user/CommunityFavoritesPage.css';

function formatDate(dateString) {
  if (!dateString) return '상시 진행';
  return dateString.replaceAll('-', '.');
}

function getGoalTypeLabel(goalType) {
  if (goalType === 'STUDY_COUNT') return '학습 횟수';
  if (goalType === 'SPEAKING_COUNT') return '말하기 횟수';
  if (goalType === 'STUDY_TIME') return '학습 시간';
  if (goalType === 'PRONUNCIATION_SCORE') return '발음 점수';
  return goalType;
}

function getPeriodLabel(periodType) {
  if (periodType === 'DAILY') return '일간 목표';
  if (periodType === 'WEEKLY') return '주간 목표';
  if (periodType === 'MONTHLY') return '월간 목표';
  return '상시 목표';
}

function getProgressPercent(currentValue, targetValue) {
  if (!targetValue || targetValue <= 0) return 0;
  return Math.min(100, Math.round((currentValue / targetValue) * 100));
}

function isGoalAchieved(goal) {
  return goal.currentValue >= goal.targetValue;
}

function StatusBadge({ label, tone = 'neutral' }) {
  return (
    <span className={`community-favorites-status-badge is-${tone}`}>
      {label}
    </span>
  );
}

function GoalCard({ goal, onCancel, showCancel = true }) {
  const achieved = isGoalAchieved(goal);
  const progressPercent = getProgressPercent(goal.currentValue, goal.targetValue);

  return (
    <article className="community-favorites-goal-card">
      <div className="community-favorites-goal-head">
        <div>
          <div className="community-favorites-goal-title-row">
            <h4>{goal.goalTitle}</h4>

            <StatusBadge
              label={
                goal.status === 'COMPLETED' || achieved
                  ? '목표 달성'
                  : goal.status === 'ACTIVE'
                    ? '진행 중'
                    : '종료'
              }
              tone={
                goal.status === 'COMPLETED' || achieved
                  ? 'success'
                  : goal.status === 'ACTIVE'
                    ? 'info'
                    : 'muted'
              }
            />
          </div>
        </div>

        {goal.status === 'ACTIVE' && showCancel ? (
          <button
            type="button"
            className="community-favorites-danger-button"
            onClick={() => onCancel(goal.userGoalId)}
          >
            목표 해제
          </button>
        ) : null}
      </div>

      <div className="community-favorites-chip-row">
        <span className="community-favorites-chip is-progress">
          {getPeriodLabel(goal.periodType)}
        </span>
        <span className="community-favorites-chip is-goal">
          {getGoalTypeLabel(goal.goalType)}
        </span>
        <span className="community-favorites-chip is-goal">
          {goal.currentValue} / {goal.targetValue}
        </span>
      </div>

      <progress
        className="community-favorites-progress"
        value={progressPercent}
        max="100"
      />

      <div className="community-favorites-meta-row">
        <span>{`진행률 ${progressPercent}%`}</span>
        <span>{`시작일 ${formatDate(goal.startDate)}`}</span>
        <span>
          {goal.endDate ? `종료일 ${formatDate(goal.endDate)}` : '상시 진행'}
        </span>
      </div>
    </article>
  );
}

function GoalMasterCard({ goal, disabled, onAdd }) {
  return (
    <article className="mapingo-select-item mapingo-static-card">
      <div className="community-favorites-route-main">
        <strong>{goal.goalTitle}</strong>

        <div className="community-favorites-chip-row">
          <span className="community-favorites-chip is-progress">
            {getPeriodLabel(goal.periodType)}
          </span>
          <span className="community-favorites-chip is-goal">
            {getGoalTypeLabel(goal.goalType)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className={`community-favorites-select-button ${disabled ? 'is-disabled' : ''
          }`}
        onClick={() => onAdd(goal.goalMasterId)}
        disabled={disabled}
      >
        {disabled ? '추가 불가' : '목표 추가'}
      </button>
    </article>
  );
}

export default function CommunityLearningPage() {
  const completedSectionRef = useRef(null);

  const {
    MAX_ACTIVE_GOALS,
    availableGoals,
    activeGoals,
    feedbackMessage,
    loading,
    visibleAvailableGoals,
    hasMoreAvailableGoals,
    selectedGoalMasterIds,
    inProgressGoals,
    achievedActiveGoals,
    displayCompletedGoals,
    handleAddGoal,
    handleCancelGoal,
    handleShowMoreGoals,
  } = useLearningGoals();

  const handleMoveToCompleted = () => {
    completedSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="커뮤니티"
        title="학습 목표를 관리해보세요"
        description="원하는 목표를 골라 진행도를 확인하고 완료 이력을 관리할 수 있어요."
      />

      <section className="mapingo-page-section">
        <div className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>학습 목표</h3>
            <span className="mapingo-muted-copy">
              {loading
                ? '불러오는 중'
                : `진행 중 ${activeGoals.length} / ${MAX_ACTIVE_GOALS}`}
            </span>
          </div>

          <p className="community-favorites-section-copy">
            원하는 목표를 골라서 최대 3개까지만 동시에 관리할 수 있어요.
          </p>

          {achievedActiveGoals.length > 0 ? (
            <button
              type="button"
              className="community-favorites-more-button"
              onClick={handleMoveToCompleted}
            >
              달성한 목표 확인하기
            </button>
          ) : null}

          <div className="community-favorites-goal-layout">
            <div className="community-favorites-column">
              <div className="community-favorites-subsection-head">
                <h4>진행 중인 목표</h4>
                <span>현재 집중하고 있는 목표</span>
              </div>

              {inProgressGoals.length === 0 ? (
                <div className="community-favorites-empty-card">
                  아직 진행 중인 목표가 없어요.
                </div>
              ) : (
                <div className="community-favorites-goal-list">
                  {inProgressGoals.map((goal) => (
                    <GoalCard
                      key={goal.userGoalId}
                      goal={goal}
                      onCancel={handleCancelGoal}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="community-favorites-column">
              <div className="community-favorites-subsection-head">
                <h4>추가 가능한 목표</h4>
                <span>원하는 목표를 골라 새로 시작해보세요</span>
              </div>

              {availableGoals.length === 0 ? (
                <div className="community-favorites-empty-card">
                  지금 추가 가능한 목표가 없어요.
                </div>
              ) : (
                <>
                  <div className="mapingo-selectable-list">
                    {visibleAvailableGoals.map((goal) => {
                      const alreadySelected = selectedGoalMasterIds.includes(
                        goal.goalMasterId,
                      );

                      const disabled =
                        alreadySelected ||
                        activeGoals.length >= MAX_ACTIVE_GOALS;

                      return (
                        <GoalMasterCard
                          key={goal.goalMasterId}
                          goal={goal}
                          disabled={disabled}
                          onAdd={handleAddGoal}
                        />
                      );
                    })}
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

              <p
                className={`community-favorites-selection-message ${feedbackMessage ? 'is-error' : ''
                  }`}
              >
                {feedbackMessage ||
                  '완료된 목표는 아래 완료 이력에서 다시 확인할 수 있어요.'}
              </p>
            </div>
          </div>

          <div className="community-favorites-history" ref={completedSectionRef}>
            <div className="community-favorites-subsection-head">
              <h4>완료된 목표</h4>
              <span>달성을 마친 목표 이력</span>
            </div>

            {displayCompletedGoals.length === 0 ? (
              <div className="community-favorites-empty-card">
                완료된 목표가 아직 없어요.
              </div>
            ) : (
              <div className="community-favorites-goal-list">
                {displayCompletedGoals.map((goal) => (
                  <GoalCard
                    key={`${goal.userGoalId}-${goal.status}`}
                    goal={goal}
                    onCancel={handleCancelGoal}
                    showCancel={goal.status === 'ACTIVE'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}