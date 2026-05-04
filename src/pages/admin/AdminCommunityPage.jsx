import { useMemo, useState } from 'react';
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
};

const statusClassMap = {
  PENDING: 'is-reserved',
  RESOLVED: 'is-published',
  ACCEPTED: 'is-published',
  BLOCKED: 'is-draft',
  REJECTED: 'is-draft',
};

const communityTabs = [
  {
    id: 'goals',
    label: '목표 관리',
    kicker: '핵심 관리',
    description: '목표 템플릿을 등록하고 수정하며 삭제와 비활성화 상태까지 한 번에 관리합니다.',
    api: 'POST · PATCH · DELETE · GET',
  },
  {
    id: 'reports',
    label: '신고 관리',
    kicker: '처리 관리',
    description: '접수된 신고를 확인하고 PENDING 상태를 RESOLVED로 처리합니다.',
    api: 'GET list · GET detail · PATCH status',
  },
  {
    id: 'friends',
    label: '친구 관리',
    kicker: 'Social Admin',
    description: '신고 목록, 상세 조회, 상태 변경과 차단/거절 이력 조회를 이 화면에서 처리합니다.',
    api: 'GET list · GET detail · PATCH status · GET history',
  },
  {
    id: 'ranking',
    label: '랭킹 관리',
    kicker: '순위 확인',
    description: '전체 랭킹과 주간 랭킹 리스트를 구분해 조회합니다.',
    api: 'GET /ranking or /admin/ranking',
  },
];

const rankingScopeOptions = [
  { id: 'overall', label: '전체랭킹' },
  { id: 'weekly', label: '주간랭킹' },
];

const communityEntryTabs = communityTabs.filter((tab) => tab.id !== 'reports');

function includesSearch(fields, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return fields.join(' ').toLowerCase().includes(normalizedQuery);
}

function getNowLabel() {
  return '2026-04-29 09:00';
}

function AdminCommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const panelParam = searchParams.get('panel');
  const activePanel = communityTabs.some((tab) => tab.id === panelParam) ? panelParam : null;

  const [goals, setGoals] = useState(() => adminService.fetchAdminCommunityGoals());
  const [reports, setReports] = useState(() => adminService.fetchAdminCommunityReports());
  const [friends] = useState(() => adminService.fetchAdminCommunityFriends());
  const [ranking] = useState(() => adminService.fetchAdminCommunityRanking());

  const [goalForm, setGoalForm] = useState(emptyGoalForm);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const [reportSearch, setReportSearch] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [rankingSearch, setRankingSearch] = useState('');
  const [rankingScope, setRankingScope] = useState('overall');

  const [selectedReportId, setSelectedReportId] = useState(() => adminService.fetchAdminCommunityReports()[0]?.id ?? null);
  const [reportDrafts, setReportDrafts] = useState({});
  const [reportError, setReportError] = useState('');

  const blockedFriends = friends.filter((friend) => friend.status === 'BLOCKED');
  const rejectedFriends = friends.filter((friend) => friend.status === 'REJECTED');

  const activeTab = communityTabs.find((tab) => tab.id === activePanel);

  const sortedGoals = useMemo(
    () => [...goals].sort((left, right) => left.displayOrder - right.displayOrder),
    [goals],
  );

  const editingGoal = goals.find((goal) => goal.id === editingGoalId) ?? null;

  const filteredReports = useMemo(
    () =>
      reports.filter((report) =>
        includesSearch(
          [
            report.reporterName,
            report.reporterEmail,
            report.targetName,
            report.targetEmail,
            report.reason,
            report.status,
            report.adminMemo,
          ],
          activePanel === 'friends' ? friendSearch : reportSearch,
        ),
      ),
    [activePanel, friendSearch, reportSearch, reports],
  );

  const selectedReport = reports.find((report) => report.id === selectedReportId) ?? filteredReports[0] ?? null;

  const activeReportDraft = selectedReport
    ? reportDrafts[selectedReport.id] ?? { status: selectedReport.status, adminMemo: selectedReport.adminMemo ?? '' }
    : { status: '', adminMemo: '' };

  const friendHistories = useMemo(() => [...blockedFriends, ...rejectedFriends], [blockedFriends, rejectedFriends]);

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

  const resetGoalForm = () => {
    setEditingGoalId(null);
    setGoalForm({ ...emptyGoalForm, displayOrder: String(goals.length + 1) });
  };

  const handlePanelSelect = (panel) => {
    setSearchParams({ panel });
    resetGoalForm();
  };

  const handlePanelBack = () => {
    setSearchParams({});
    resetGoalForm();
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    const title = goalForm.title.trim();
    const description = goalForm.description.trim();
    if (!title || !description) return;

    const nextGoal = {
      id: editingGoalId ?? Math.max(0, ...goals.map((goal) => goal.id)) + 1,
      title,
      description,
      goalType: goalForm.goalType,
      targetValue: Number(goalForm.targetValue),
      periodType: goalForm.periodType,
      displayOrder: Number(goalForm.displayOrder),
      isActive: goalForm.isActive,
      updatedAt: '2026-04-28',
    };

    setGoals((currentGoals) =>
      editingGoalId
        ? currentGoals.map((goal) => (goal.id === editingGoalId ? nextGoal : goal))
        : [nextGoal, ...currentGoals],
    );
    setGoalForm({ ...emptyGoalForm, displayOrder: String(goals.length + 2) });
    setEditingGoalId(null);
  };

  const handleEditGoal = (goal) => {
    setSearchParams({ panel: 'goals' });
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

  const handleDeactivateGoal = (goalId) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId ? { ...goal, isActive: false, updatedAt: '2026-04-28' } : goal,
      ),
    );
    if (editingGoalId === goalId) resetGoalForm();
  };

  const handleDeleteGoal = (goalId) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));
    if (editingGoalId === goalId) resetGoalForm();
  };

  const handleSaveReportStatus = (reportId) => {
    const targetReport = reports.find((report) => report.id === reportId);
    if (!targetReport) return;

    const draft = reportDrafts[reportId] ?? {
      status: targetReport.status,
      adminMemo: targetReport.adminMemo ?? '',
    };

    const trimmedMemo = draft.adminMemo.trim();
    if (!trimmedMemo) {
      setReportError('상태 변경 시 관리자 메모를 입력해야 합니다.');
      return;
    }

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: draft.status,
              adminMemo: trimmedMemo,
              processedAt: getNowLabel(),
            }
          : report,
      ),
    );

    setReportDrafts((currentDrafts) => ({
      ...currentDrafts,
      [reportId]: {
        status: draft.status,
        adminMemo: trimmedMemo,
      },
    }));

    setReportError('');
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="커뮤니티 관리"
        description="목표, 신고, 친구, 랭킹을 관리자 화면 안에서 조회하고 운영 처리합니다."
      />

      {!activePanel ? (
        <section className="mapingo-page-section">
          <div className="mapingo-domain-entry-grid admin-entry-grid admin-community-entry-grid">
            {communityEntryTabs.map((tab, index) => (
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
