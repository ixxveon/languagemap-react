import { useEffect, useMemo, useState } from 'react';
import { useAdminLearningGoals } from '../../hooks/community/useAdminLearningGoals';
import { includesSearch } from '../../utils/community/search';
import '../../styles/admin/AdminLearningGoalPage.css';

const goalTypeLabels = {
  STUDY_COUNT: '학습 횟수',
  PRONUNCIATION_SCORE: '발음 점수',
  SPEAKING_COUNT: '말하기 횟수',
  STUDY_TIME: '학습 시간',
};

const periodLabels = {
  DAILY: '일간',
  WEEKLY: '주간',
  MONTHLY: '월간',
  NONE: '없음',
};

function AdminLearningGoalPage() {
  const [goalSearch, setGoalSearch] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);

  const {
    goalForm,
    setGoalForm,
    editingGoalId,
    editingGoal,
    sortedGoals,
    goalLoading,
    goalError,
    handleGoalSubmit,
    handleEditGoal,
    handleToggleGoal,
    handleDeleteGoal,
    resetGoalForm,
  } = useAdminLearningGoals();

  const filteredGoals = useMemo(
    () =>
      sortedGoals.filter((goal) =>
        includesSearch(
          [
            goal.title,
            goal.description,
            goalTypeLabels[goal.goalType] ?? goal.goalType,
            periodLabels[goal.periodType] ?? goal.periodType,
            String(goal.targetValue),
            String(goal.id),
          ],
          goalSearch,
        ),
      ),
    [goalSearch, sortedGoals],
  );

  useEffect(() => {
    if (selectedGoalId && !sortedGoals.some((goal) => goal.id === selectedGoalId)) {
      setSelectedGoalId(null);
    }
  }, [selectedGoalId, sortedGoals]);

  useEffect(() => {
    if (
      !hasInitializedSelection &&
      !isCreateMode &&
      !editingGoalId &&
      !selectedGoalId &&
      filteredGoals.length > 0
    ) {
      const firstGoal = filteredGoals[0];

      setSelectedGoalId(firstGoal.id);
      setHasInitializedSelection(true);
      handleEditGoal(firstGoal);
    }
  }, [
    editingGoalId,
    filteredGoals,
    handleEditGoal,
    hasInitializedSelection,
    isCreateMode,
    selectedGoalId,
  ]);

  const selectedGoal =
    sortedGoals.find((goal) => goal.id === selectedGoalId) ??
    filteredGoals.find((goal) => goal.id === editingGoalId) ??
    null;

  const handleSelectGoal = (goal) => {
    setIsCreateMode(false);
    setSelectedGoalId(goal.id);
    handleEditGoal(goal);
  };

  const handleCreateNew = () => {
    setIsCreateMode(true);
    setSelectedGoalId(null);
    resetGoalForm();
  };

  const handleSubmitGoal = async (event) => {
    const isSuccess = await handleGoalSubmit(event);

    if (!isSuccess) {
      return;
    }

    setIsCreateMode(true);
    setSelectedGoalId(null);
  };

  const handleDeleteSelectedGoal = async () => {
    if (!selectedGoal) {
      return;
    }

    const isSuccess = await handleDeleteGoal(selectedGoal.id);

    if (!isSuccess) {
      return;
    }

    setIsCreateMode(true);
    setSelectedGoalId(null);
  };

  const handleToggleSelectedGoal = async () => {
    if (!selectedGoal) {
      return;
    }

    const isSuccess = await handleToggleGoal(selectedGoal);

    if (!isSuccess) {
      return;
    }

    setSelectedGoalId(selectedGoal.id);
  };

  return (
    <section className="mapingo-page-section admin-learning-page">
      <div className="mapingo-admin-grid admin-content-layout">
        <div className="mapingo-list-card admin-learning-list">
          <div className="mapingo-card-header-row admin-result-head">
            <div>
              <h3>학습 목표 목록</h3>
              <p className="mapingo-muted-copy">
                등록된 목표를 검색하고 선택하면 오른쪽에서 상세 내용과 상태를 바로 관리할 수 있습니다.
              </p>
            </div>

            <span className="mapingo-inline-badge">{filteredGoals.length}개</span>
          </div>

          <input
            className="mapingo-input admin-notice-search"
            type="search"
            value={goalSearch}
            onChange={(event) => setGoalSearch(event.target.value)}
            placeholder="목표명, 설명, 타입 검색"
          />

          {goalLoading ? <p className="mapingo-muted-copy">목표 목록을 불러오는 중입니다.</p> : null}
          {goalError ? <p className="mapingo-muted-copy">{goalError}</p> : null}

          <div className="mapingo-selectable-list admin-learning-scroll-list">
            {filteredGoals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                className={`mapingo-post-card admin-content-card admin-learning-goal-card ${selectedGoal?.id === goal.id ? 'is-selected' : ''
                  }`}
                onClick={() => handleSelectGoal(goal)}
              >
                <div className="mapingo-admin-item-head">
                  <div>
                    <strong>{goal.title}</strong>
                    <p>
                      {goalTypeLabels[goal.goalType]} · {periodLabels[goal.periodType]} · 목표값{' '}
                      {goal.targetValue}
                    </p>
                  </div>

                  <span
                    className={`admin-notice-status ${goal.isActive ? 'is-published' : 'is-draft'}`}
                  >
                    {goal.isActive ? '활성' : '비활성'}
                  </span>
                </div>

                <p className="admin-content-description admin-learning-goal-description">
                  {goal.description}
                </p>
              </button>
            ))}

            {!goalLoading && filteredGoals.length === 0 ? (
              <div className="admin-content-empty-state">검색 결과에 맞는 학습 목표가 없습니다.</div>
            ) : null}
          </div>
        </div>

        <div className="mapingo-form-card admin-learning-detail-card">
          <div className="mapingo-card-header-row admin-builder-head">
            <div>
              <h3>{editingGoal ? '학습 목표 상세 수정' : '새 학습 목표 등록'}</h3>
              <p className="mapingo-muted-copy">
                선택한 목표의 정보를 한쪽에서 확인하고 바로 수정할 수 있습니다.
              </p>
            </div>

            <button type="button" className="mapingo-ghost-button" onClick={handleCreateNew}>
              새 목표 등록
            </button>
          </div>

          {selectedGoal ? (
            <section className="admin-entity-section admin-learning-detail-panel">
              <div className="admin-entity-head">
                <strong>{selectedGoal.title}</strong>

                <span
                  className={`admin-notice-status ${selectedGoal.isActive ? 'is-published' : 'is-draft'
                    }`}
                >
                  {selectedGoal.isActive ? '활성' : '비활성'}
                </span>
              </div>

              <div className="mapingo-admin-meta-grid admin-learning-detail-grid">
                <p>
                  <strong>목표 ID</strong>
                  {selectedGoal.id}
                </p>

                <p>
                  <strong>목표 타입</strong>
                  {goalTypeLabels[selectedGoal.goalType]}
                </p>

                <p>
                  <strong>목표 기간</strong>
                  {periodLabels[selectedGoal.periodType]}
                </p>

                <p>
                  <strong>목표 값</strong>
                  {selectedGoal.targetValue}
                </p>
              </div>
            </section>
          ) : (
            <div className="admin-content-tags admin-learning-create-tags">
              <span>신규 목표</span>
              <span>작성 후 바로 등록</span>
            </div>
          )}

          <form className="mapingo-admin-form admin-builder-form" onSubmit={handleSubmitGoal}>
            <label className="mapingo-field">
              <span className="mapingo-field-label">목표 이름</span>
              <input
                className="mapingo-input"
                value={goalForm.title}
                onChange={(event) =>
                  setGoalForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label className="mapingo-field">
              <span className="mapingo-field-label">목표 설명</span>
              <textarea
                className="mapingo-input mapingo-admin-textarea admin-learning-description-input"
                value={goalForm.description}
                onChange={(event) =>
                  setGoalForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                required
              />
            </label>

            <div className="admin-content-form-grid admin-learning-form-grid">
              <label className="mapingo-field">
                <span className="mapingo-field-label">목표 타입</span>
                <select
                  className="mapingo-input"
                  value={goalForm.goalType}
                  onChange={(event) =>
                    setGoalForm((current) => ({
                      ...current,
                      goalType: event.target.value,
                    }))
                  }
                >
                  {Object.entries(goalTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mapingo-field">
                <span className="mapingo-field-label">목표 값</span>
                <input
                  className="mapingo-input"
                  type="number"
                  min="1"
                  value={goalForm.targetValue}
                  onChange={(event) =>
                    setGoalForm((current) => ({
                      ...current,
                      targetValue: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="mapingo-field">
                <span className="mapingo-field-label">목표 기간</span>
                <select
                  className="mapingo-input"
                  value={goalForm.periodType}
                  onChange={(event) =>
                    setGoalForm((current) => ({
                      ...current,
                      periodType: event.target.value,
                    }))
                  }
                >
                  {Object.entries(periodLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mapingo-admin-action-row admin-learning-action-row">
              <button type="submit" className="mapingo-submit-button">
                {editingGoalId ? '목표 수정 저장' : '목표 등록'}
              </button>

              {editingGoalId ? (
                <button type="button" className="mapingo-ghost-button" onClick={handleCreateNew}>
                  선택 해제
                </button>
              ) : null}

              {selectedGoal ? (
                <button
                  type="button"
                  className={`mapingo-ghost-button ${selectedGoal.isActive ? 'btn-deactivate' : 'btn-activate'
                    }`}
                  onClick={handleToggleSelectedGoal}
                >
                  {selectedGoal.isActive ? '비활성화' : '활성화'}
                </button>
              ) : null}

              {selectedGoal ? (
                <button
                  type="button"
                  className="mapingo-ghost-button"
                  onClick={handleDeleteSelectedGoal}
                >
                  삭제
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AdminLearningGoalPage;