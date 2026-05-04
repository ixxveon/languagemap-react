import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminService } from '../../api/adminService';

const emptyGoalForm = {
  title: '',
  description: '',
  goalType: 'STUDY_COUNT',
  targetValue: '1',
  periodType: 'WEEKLY',
  displayOrder: '1',
  isActive: true,
};

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
  NONE: '없음'
};

function normalizeGoal(goal) {
  return {
    id: goal.goalMasterId ?? goal.id,
    title: goal.goalTitle ?? goal.title,
    description: goal.goalDescription ?? goal.description,
    goalType: goal.goalType,
    targetValue: goal.targetValue,
    periodType: goal.periodType,
    displayOrder: goal.displayOrder ?? 1,
    isActive: goal.active,
    updatedAt: goal.updatedAt ?? '-',
  };
}

function AdminCommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const panelParam = searchParams.get('panel');
  const activePanel = panelParam === 'goals' ? panelParam : null;

  const [goal, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState(emptyGoalForm);
  const [editingGoal, setEditingGoalId] = useState(null);
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState('');

  const sortedGoal = useMemo(
    () => [...goals].sort((left, right) => left.displayOrder), 
    [goals],
  );

  const editingGoal = goals.find((goal) => goal.id === editingGoalId) ?? null;

  const fetchGoals = async () => {
    try {
      setGoalLoading(true);
      setGoalError('');

      const data = await adminService.getGoals();
      setGoals((data ?? []).map(normalizeGoal));
    } catch (error) {
      console.error(error);
      setGoalError('목표 목록을 불러오지 못했습니다.');
    } finally {
      setGoalLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const resetGoalForm = () => {
    setEditingGoalId(null);
    setGoalForm({
      ...emptyGoalForm,
      displayOrder: String(goals.length + 1),
    });
  };

  const handlePanelSelect = (panel) => {
    setSearchParams({ panel });
    resetGoalForm();
  };

  const handlePanelBack = () => {
    setSearchParams({});
    resetGoalForm();
  };

  const handleGoalSubmit = async (event) => {
    event.preventDefault();

    const title = goalForm.title.trim();
    const description = goalForm.description.trim();

    ig (!title || !description) {
      alert('목표명과 설명을 입력해주세요.');
      return;
    }

    const requestBody = {
      badgeId: null,
      goalType: goalForm.goalType,
      goalTitle: title,
      goalDescription: description,
      targetValue: Number(goalForm.targetValue),
      periodType: goalForm.periodType,
    };

    try {
      if (editingGoalId) {
        await adminService.updateGoal(editingGoal, requestBody);
        alert('목표가 수정되었습니다.');
      } else {
        await adminService.createGoal(requestBody);
        alert('목표가 등록되었습니다.');
      }

      await fetchGoals();
      resetGoalForm();
    } catch (error) {
      console.error(error);
      alert('목표 저장 중 오류가 발생했습니다.');
    }
  };

  const handleEditGoal = (goal) => {
    setSearchParams({ panel: 'goals'});
    setEditingGoalId(goal.id);
    setGoalForm({
      title: goal.title,
      description: goal.description,
      goalType: goal.goalType,
      targetValue: String(goal.targetValue),
      periodType: goal.periodType,
      displayOrder: String(goal.displayOrder),
      isActive: goal.isActive,
    });
  };

  const handleDeactivateGoal = async (goalId) => {
    try {
      await adminService.updateGoalActive(goalId, false);
      alert('목표가 비활성화되었습니다.');
      await fetchGoals();

      if (editingGoalId === goalId) {
        resetGoalForm();
      }
    } catch (error) {
      console.error(error);
      alert('목표 비활성화 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await adminService.deleteGoal(goalId);
      alert('목표가 삭제되었습니다.');
      await fetchGoals();

      if (editingGoalId === goalId) {
        resetGoalForm();
      }
    } catch (error) {
      console.error(error);
      alert('목표 삭제 중 오류가 발생했습니다.');
    }
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
              <button
                type="button"
                className="mapingo-domain-entry-card admin-entry-card admin-community-entry-card"
                onClick={() => handlePanelSelect('goals')}
              >
                <div className="community-entry-card-top">
                  <span className="community-entry-accent">핵심 관리</span>
                  <span className="community-entry-index">01</span>
                </div>
                <div className="community-entry-card-body">
                  <h3>목표 관리</h3>
                  <p>목표 템플릿을 등록하고 수정하며 삭제와 비활성화 상태까지 한 번에 관리합니다.</p>
                </div>
              </button>
          </div>
        </section>
      ) : null}

      {activePanel ? (
        <>
          <section className="mapingo-page-section">
            <div className="mapingo-card-header-row admin-result-head">
              <div>
                <p className="mapingo-eyebrow">Community Admin</p>
                <h3>{activeTab?.label}</h3>
                <p className="mapingo-muted-copy">{activeTab?.description}</p>
              </div>
              <button type="button" className="mapingo-ghost-button" onClick={handlePanelBack}>
                기능 선택으로
              </button>
            </div>
          </section>
        </>
      ) : null}

      {activePanel ? (
        <section className="mapingo-page-section">
          {activePanel === 'goals' ? (
            <div className="mapingo-admin-grid admin-content-layout">
              <div className="mapingo-form-card">
                <div className="mapingo-card-header-row admin-builder-head">
                  <div>
                    <h3>{editingGoalId ? '목표 템플릿 상세 / 수정' : '목표 템플릿 등록'}</h3>
                    <p className="mapingo-muted-copy">POST와 PATCH에 대응되는 목표 템플릿 정보를 입력합니다.</p>
                  </div>
                  <span className="mapingo-inline-badge">{communityTabs[0].api}</span>
                </div>

                <form className="mapingo-admin-form admin-builder-form" onSubmit={handleGoalSubmit}>
                  {editingGoal ? (
                    <div className="admin-content-tags">
                      <span>ID {editingGoal.id}</span>
                      <span>{goalTypeLabels[editingGoal.goalType]}</span>
                      <span>{periodLabels[editingGoal.periodType]}</span>
                      <span>{editingGoal.isActive ? '활성' : '비활성'}</span>
                      <span>수정일 {editingGoal.updatedAt}</span>
                    </div>
                  ) : null}
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">목표 템플릿명</span>
                    <input
                      className="mapingo-input"
                      value={goalForm.title}
                      onChange={(event) => setGoalForm((current) => ({ ...current, title: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">설명</span>
                    <textarea
                      className="mapingo-input mapingo-admin-textarea"
                      value={goalForm.description}
                      onChange={(event) => setGoalForm((current) => ({ ...current, description: event.target.value }))}
                      required
                    />
                  </label>
                  <div className="admin-content-form-grid">
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">목표 타입</span>
                      <select
                        className="mapingo-input"
                        value={goalForm.goalType}
                        onChange={(event) => setGoalForm((current) => ({ ...current, goalType: event.target.value }))}
                      >
                        {Object.entries(goalTypeLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">목표값</span>
                      <input
                        className="mapingo-input"
                        type="number"
                        min="1"
                        value={goalForm.targetValue}
                        onChange={(event) => setGoalForm((current) => ({ ...current, targetValue: event.target.value }))}
                      />
                    </label>
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">기간</span>
                      <select
                        className="mapingo-input"
                        value={goalForm.periodType}
                        onChange={(event) => setGoalForm((current) => ({ ...current, periodType: event.target.value }))}
                      >
                        {Object.entries(periodLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">노출 순서</span>
                      <input
                        className="mapingo-input"
                        type="number"
                        min="1"
                        value={goalForm.displayOrder}
                        onChange={(event) => setGoalForm((current) => ({ ...current, displayOrder: event.target.value }))}
                      />
                    </label>
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">상태</span>
                      <select
                        className="mapingo-input"
                        value={goalForm.isActive ? 'ACTIVE' : 'INACTIVE'}
                        onChange={(event) =>
                          setGoalForm((current) => ({ ...current, isActive: event.target.value === 'ACTIVE' }))
                        }
                      >
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                      </select>
                    </label>
                  </div>
                  <div className="mapingo-admin-action-row">
                    <button type="submit" className="mapingo-submit-button">
                      {editingGoalId ? '목표 템플릿 수정 저장' : '목표 템플릿 등록'}
                    </button>
                    {editingGoalId ? (
                      <button type="button" className="mapingo-ghost-button" onClick={resetGoalForm}>
                        취소
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>

              <div className="mapingo-list-card">
                <div className="mapingo-card-header-row admin-result-head">
                  <div>
                    <h3>목표 템플릿 목록</h3>
                    <p className="mapingo-muted-copy">클릭 시 상세 조회와 수정을 진행하고, DELETE로 템플릿을 삭제합니다.</p>
                  </div>
                  <span className="mapingo-inline-badge">{sortedGoals.length}개</span>
                </div>
                <div className="admin-entity-stack admin-growth-stack">
                  {sortedGoals.map((goal) => (
                    <article key={goal.id} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{goal.title}</strong>
                          <p>{goal.description}</p>
                        </div>
                        <span className={`admin-notice-status ${goal.isActive ? 'is-published' : 'is-draft'}`}>
                          {goal.isActive ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="admin-content-tags">
                        <span>{goalTypeLabels[goal.goalType]}</span>
                        <span>{periodLabels[goal.periodType]}</span>
                        <span>목표값 {goal.targetValue}</span>
                        <span>순서 {goal.displayOrder}</span>
                      </div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => handleEditGoal(goal)}>
                          수정
                        </button>
                        <button
                          type="button"
                          className="mapingo-ghost-button"
                          onClick={() => handleDeactivateGoal(goal.id)}
                          disabled={!goal.isActive}
                        >
                          비활성화
                        </button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteGoal(goal.id)}>
                          삭제
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activePanel === 'reports' ? (
            <div className="mapingo-admin-grid admin-content-layout">
              <div className="mapingo-list-card">
                <div className="mapingo-card-header-row admin-result-head">
                  <div>
                    <h3>신고 목록 조회</h3>
                    <p className="mapingo-muted-copy">신고자를 선택하면 오른쪽에서 상세 내용을 확인합니다.</p>
                  </div>
                  <span className="mapingo-inline-badge">{communityTabs[1].api}</span>
                </div>
                <input
                  className="mapingo-input admin-notice-search"
                  type="search"
                  value={reportSearch}
                  onChange={(event) => setReportSearch(event.target.value)}
                  placeholder="신고자, 대상자, 사유, 상태 검색"
                />
                <div className="mapingo-selectable-list">
                  {filteredReports.map((report) => (
                    <button
                      key={report.id}
                      type="button"
                      className={`mapingo-post-card admin-content-card ${
                        selectedReport?.id === report.id ? 'is-selected' : ''
                      }`}
                      onClick={() => setSelectedReportId(report.id)}
                    >
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{report.targetName}</strong>
                          <p>신고자 {report.reporterName} · {report.createdAt}</p>
                        </div>
                        <span className={`admin-notice-status ${statusClassMap[report.status] ?? 'is-draft'}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="admin-content-description">{report.reason}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mapingo-form-card">
                <div className="mapingo-card-header-row admin-builder-head">
                  <div>
                    <h3>신고 상세 조회</h3>
                    <p className="mapingo-muted-copy">PENDING 신고는 처리 완료 상태로 변경할 수 있습니다.</p>
                  </div>
                </div>
                {selectedReport ? (
                  <section className="admin-entity-section">
                    <div className="admin-entity-head">
                      <strong>{selectedReport.targetName}</strong>
                      <span className={`admin-notice-status ${statusClassMap[selectedReport.status] ?? 'is-draft'}`}>
                        {selectedReport.status}
                      </span>
                    </div>
                    <div className="mapingo-admin-meta-grid admin-community-meta-grid">
                      <p><strong>신고자</strong>{selectedReport.reporterName}<br />{selectedReport.reporterEmail}</p>
                      <p><strong>대상자</strong>{selectedReport.targetName}<br />{selectedReport.targetEmail}</p>
                      <p><strong>접수일</strong>{selectedReport.createdAt}</p>
                      <p><strong>처리일</strong>{selectedReport.processedAt || '-'}</p>
                    </div>
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">신고 사유</span>
                      <textarea className="mapingo-input mapingo-admin-textarea" value={selectedReport.reason} readOnly />
                    </label>
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">관리자 메모</span>
                      <textarea
                        className="mapingo-input mapingo-admin-textarea"
                        value={selectedReport.adminMemo}
                        onChange={(event) =>
                          setReports((currentReports) =>
                            currentReports.map((report) =>
                              report.id === selectedReport.id ? { ...report, adminMemo: event.target.value } : report,
                            ),
                          )
                        }
                        placeholder="처리 메모를 입력하세요"
                      />
                    </label>
                    <div className="mapingo-admin-action-row">
                      <button
                        type="button"
                        className="mapingo-submit-button"
                        onClick={() => handleSaveReportStatus(selectedReport.id)}
                        disabled={selectedReport.status === 'RESOLVED'}
                      >
                        RESOLVED 처리
                      </button>
                    </div>
                  </section>
                ) : (
                  <div className="admin-content-empty-state">선택할 신고가 없습니다.</div>
                )}
              </div>
            </div>
          ) : null}

          {activePanel === 'friends' ? (
            <>
              <div className="mapingo-admin-grid admin-content-layout">
                <div className="mapingo-list-card">
                  <div className="mapingo-card-header-row admin-result-head">
                    <div>
                      <h3>신고 목록 조회</h3>
                      <p className="mapingo-muted-copy">소셜 신고 목록을 선택하면 오른쪽에서 상세 조회와 상태 변경을 진행합니다.</p>
                    </div>
                    <span className="mapingo-inline-badge">{filteredReports.length}건</span>
                  </div>
                  <input
                    className="mapingo-input admin-notice-search"
                    type="search"
                    value={friendSearch}
                    onChange={(event) => setFriendSearch(event.target.value)}
                    placeholder="신고자, 대상자, 사유, 상태 검색"
                  />
                  <div className="mapingo-selectable-list">
                    {filteredReports.map((report) => (
                      <button
                        key={report.id}
                        type="button"
                        className={`mapingo-post-card admin-content-card ${
                          selectedReport?.id === report.id ? 'is-selected' : ''
                        }`}
                        onClick={() => {
                          setSelectedReportId(report.id);
                          setReportError('');
                        }}
                      >
                        <div className="mapingo-admin-item-head">
                          <div>
                            <strong>{report.targetName}</strong>
                            <p>신고자 {report.reporterName} · {report.createdAt}</p>
                          </div>
                          <span className={`admin-notice-status ${statusClassMap[report.status] ?? 'is-draft'}`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="admin-content-description">{report.reason}</p>
                      </button>
                    ))}
                    {filteredReports.length === 0 ? <div className="admin-content-empty-state">신고 내역이 없습니다.</div> : null}
                  </div>
                </div>

                <div className="mapingo-form-card">
                  <div className="mapingo-card-header-row admin-builder-head">
                    <div>
                      <h3>신고 상세 조회</h3>
                      <p className="mapingo-muted-copy">상태 변경과 관리자 메모 입력을 이 영역에서 처리합니다.</p>
                    </div>
                  </div>
                  {selectedReport ? (
                    <section className="admin-entity-section">
                      <div className="admin-entity-head">
                        <strong>{selectedReport.targetName}</strong>
                        <span className={`admin-notice-status ${statusClassMap[selectedReport.status] ?? 'is-draft'}`}>
                          {selectedReport.status}
                        </span>
                      </div>
                      <div className="mapingo-admin-meta-grid admin-community-meta-grid">
                        <p><strong>신고자</strong>{selectedReport.reporterName}<br />{selectedReport.reporterEmail}</p>
                        <p><strong>대상자</strong>{selectedReport.targetName}<br />{selectedReport.targetEmail}</p>
                        <p><strong>접수일</strong>{selectedReport.createdAt}</p>
                        <p><strong>처리일</strong>{selectedReport.processedAt || '-'}</p>
                      </div>
                      <label className="mapingo-field">
                        <span className="mapingo-field-label">신고 사유</span>
                        <textarea
                          className="mapingo-input mapingo-admin-textarea"
                          value={selectedReport.reason}
                          readOnly
                        />
                      </label>
                      <div className="admin-content-form-grid">
                        <label className="mapingo-field">
                          <span className="mapingo-field-label">신고 상태</span>
                          <select
                            className="mapingo-input"
                            value={activeReportDraft.status}
                            onChange={(event) => {
                              setReportDrafts((currentDrafts) => ({
                                ...currentDrafts,
                                [selectedReport.id]: {
                                  status: event.target.value,
                                  adminMemo: activeReportDraft.adminMemo,
                                },
                              }));
                              setReportError('');
                            }}
                          >
                            {Array.from(new Set(reports.map((report) => report.status))).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <label className="mapingo-field">
                        <span className="mapingo-field-label">관리자 메모</span>
                        <textarea
                          className="mapingo-input mapingo-admin-textarea"
                          value={activeReportDraft.adminMemo}
                          onChange={(event) => {
                            setReportDrafts((currentDrafts) => ({
                              ...currentDrafts,
                              [selectedReport.id]: {
                                status: activeReportDraft.status,
                                adminMemo: event.target.value,
                              },
                            }));
                            setReportError('');
                          }}
                          placeholder="상태 변경 사유 또는 처리 메모를 입력하세요"
                        />
                      </label>
                      {reportError ? <p className="mapingo-muted-copy">{reportError}</p> : null}
                      <div className="mapingo-admin-action-row">
                        <button
                          type="button"
                          className="mapingo-submit-button"
                          onClick={() => handleSaveReportStatus(selectedReport.id)}
                        >
                          상태 변경 저장
                        </button>
                      </div>
                    </section>
                  ) : (
                    <div className="admin-content-empty-state">선택된 신고가 없습니다.</div>
                  )}
                </div>
              </div>

              <div className="mapingo-list-card">
                <div className="mapingo-card-header-row admin-result-head">
                  <div>
                    <h3>차단 / 거절 이력 조회</h3>
                    <p className="mapingo-muted-copy">요청자, 대상자, 상태, 요청일, 응답일을 조회 전용으로 확인합니다.</p>
                  </div>
                  <span className="mapingo-inline-badge">{friendHistories.length}건</span>
                </div>
                <div className="admin-entity-stack admin-growth-stack">
                  {friendHistories.map((friend) => (
                    <article key={friend.id} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{friend.requesterName} → {friend.addresseeName}</strong>
                          <p>{friend.requesterEmail} · {friend.addresseeEmail}</p>
                        </div>
                        <span className={`admin-notice-status ${statusClassMap[friend.status] ?? 'is-draft'}`}>
                          {friend.status}
                        </span>
                      </div>
                      <div className="mapingo-admin-meta-grid admin-community-meta-grid">
                        <p><strong>요청자</strong>{friend.requesterName}<br />{friend.requesterEmail}</p>
                        <p><strong>대상자</strong>{friend.addresseeName}<br />{friend.addresseeEmail}</p>
                        <p><strong>상태</strong>{friend.status}</p>
                        <p><strong>요청일</strong>{friend.requestedAt}</p>
                        <p><strong>응답일</strong>{friend.respondedAt || '-'}</p>
                      </div>
                    </article>
                  ))}
                  {friendHistories.length === 0 ? (
                    <div className="admin-content-empty-state">차단 / 거절 이력이 없습니다.</div>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}

          {activePanel === 'ranking' ? (
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
                        <strong>{item.rank}위 · {item.name}</strong>
                        <p>{rankingScope === 'weekly' ? '주간 랭킹' : '전체 랭킹'}</p>
                      </div>
                      <span className="mapingo-inline-badge">{item.score.toLocaleString('ko-KR')}점</span>
                    </div>
                  </article>
                ))}
                {filteredRanking.length === 0 ? <div className="admin-content-empty-state">랭킹 결과가 없습니다.</div> : null}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export default AdminCommunityPage;
