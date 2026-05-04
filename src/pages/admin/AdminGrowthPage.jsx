import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminService } from '../../api/adminService';

const emptyHighlightForm = {
  title: '',
  description: '',
};

const emptyLevelForm = {
  label: '',
  description: '',
};

const emptyActivityForm = {
  label: '',
  meta: '',
};

const emptyBadgeForm = {
  name: '',
  category: 'learning',
  imageUrl: '',
  description: '',
  condition: '',
  targetValue: '1',
  status: 'progress',
};

const badgeCategoryOptions = [
  { value: 'pronunciation', label: '발음' },
  { value: 'goal', label: '목표' },
  { value: 'growth', label: '성장' },
  { value: 'learning', label: '학습' },
  { value: 'streak', label: '루틴' },
];

const badgeStatusOptions = [
  { value: 'earned', label: '획득' },
  { value: 'progress', label: '진행중' },
  { value: 'locked', label: '잠김' },
];

function buildLevelId(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '');
}

function AdminGrowthPage() {
  const navigate = useNavigate();
  const [members] = useState(() => adminService.fetchAdminMembers());
  const [summary, setSummary] = useState(() => adminService.fetchAdminGrowthSummary());
  const [highlights, setHighlights] = useState(() => adminService.fetchAdminGrowthHighlights());
  const [levels, setLevels] = useState(() => adminService.fetchAdminLearningLevelOptions());
  const [goalSuggestions, setGoalSuggestions] = useState(() => adminService.fetchAdminLearningGoalSuggestions());
  const [activities, setActivities] = useState(() => adminService.fetchAdminLearningActivities());
  const [badges, setBadges] = useState(() => adminService.fetchAdminBadgeCatalog());
  const [activePanel, setActivePanel] = useState('summary');
  const [editingItem, setEditingItem] = useState(null);
  const [highlightForm, setHighlightForm] = useState(emptyHighlightForm);
  const [levelForm, setLevelForm] = useState(emptyLevelForm);
  const [goalForm, setGoalForm] = useState('');
  const [activityForm, setActivityForm] = useState(emptyActivityForm);
  const [badgeForm, setBadgeForm] = useState(emptyBadgeForm);
  const [badgePreviewUrl, setBadgePreviewUrl] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState(() => adminService.fetchAdminMembers()[0]?.id ?? '');

  const selectedMember = useMemo(
    () => members.find((member) => String(member.id) === String(selectedMemberId)) ?? members[0] ?? null,
    [members, selectedMemberId],
  );

  const completionRate = useMemo(
    () => Math.min(100, Math.round((summary.weeklyGoalCompleted / Number(summary.weeklyGoal || 1)) * 100)),
    [summary.weeklyGoal, summary.weeklyGoalCompleted],
  );

  const stats = [
    { label: '관리 회원', value: members.length, hint: '리포트 확인 대상' },
    { label: '발음 점수', value: summary.pronunciationScore, hint: '성장 지표 카드 기준' },
    { label: '유창성 점수', value: summary.fluencyScore, hint: '응답 연결력 기준' },
    { label: '주간 목표', value: `${summary.weeklyGoalCompleted}/${summary.weeklyGoal}회`, hint: `${completionRate}% 달성` },
  ];

  const resetForms = () => {
    setEditingItem(null);
    setHighlightForm(emptyHighlightForm);
    setLevelForm(emptyLevelForm);
    setGoalForm('');
    setActivityForm(emptyActivityForm);
    setBadgeForm(emptyBadgeForm);
    setBadgePreviewUrl('');
  };

  const handlePanelSelect = (panel) => {
    setActivePanel(panel);
    resetForms();
  };

  const handleSummaryChange = (field) => (event) => {
    const numberFields = [
      'pronunciationScore',
      'fluencyScore',
      'weeklyLearnCount',
      'streakDays',
      'badgeCount',
      'weeklyGoalCompleted',
      'weeklyGoal',
    ];

    setSummary((current) => ({
      ...current,
      [field]: numberFields.includes(field) ? Number(event.target.value) : event.target.value,
    }));
  };

  const handleHighlightSubmit = (event) => {
    event.preventDefault();
    if (!highlightForm.title.trim() || !highlightForm.description.trim()) return;

    const nextHighlight = {
      title: highlightForm.title.trim(),
      description: highlightForm.description.trim(),
    };

    setHighlights((current) =>
      editingItem?.type === 'highlight'
        ? current.map((item, index) => (index === editingItem.index ? nextHighlight : item))
        : [nextHighlight, ...current],
    );
    resetForms();
  };

  const handleLevelSubmit = (event) => {
    event.preventDefault();
    if (!levelForm.label.trim() || !levelForm.description.trim()) return;

    const nextLevel = {
      id: editingItem?.type === 'level' ? editingItem.id : buildLevelId(levelForm.label) || `level-${Date.now()}`,
      label: levelForm.label.trim(),
      description: levelForm.description.trim(),
    };

    setLevels((current) =>
      editingItem?.type === 'level'
        ? current.map((item) => (item.id === editingItem.id ? nextLevel : item))
        : [...current, nextLevel],
    );
    resetForms();
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    const nextGoal = goalForm.trim();
    if (!nextGoal) return;

    setGoalSuggestions((current) =>
      editingItem?.type === 'goal'
        ? current.map((item, index) => (index === editingItem.index ? nextGoal : item))
        : [nextGoal, ...current],
    );
    resetForms();
  };

  const handleActivitySubmit = (event) => {
    event.preventDefault();
    if (!activityForm.label.trim() || !activityForm.meta.trim()) return;

    const nextActivity = {
      label: activityForm.label.trim(),
      meta: activityForm.meta.trim(),
    };

    setActivities((current) =>
      editingItem?.type === 'activity'
        ? current.map((item, index) => (index === editingItem.index ? nextActivity : item))
        : [nextActivity, ...current],
    );
    resetForms();
  };

  const handleBadgeSubmit = (event) => {
    event.preventDefault();
    if (!badgeForm.name.trim() || !badgeForm.imageUrl.trim() || !badgeForm.condition.trim()) return;

    const nextBadge = {
      id: editingItem?.type === 'badge' ? editingItem.id : buildLevelId(badgeForm.name) || `badge-${Date.now()}`,
      name: badgeForm.name.trim(),
      category: badgeForm.category,
      imageUrl: badgeForm.imageUrl.trim(),
      description: badgeForm.description.trim(),
      condition: badgeForm.condition.trim(),
      targetValue: Number(badgeForm.targetValue || 1),
      currentValue: editingItem?.badge?.currentValue ?? 0,
      progressPercent: editingItem?.badge?.progressPercent ?? 0,
      status: badgeForm.status,
      earnedAt: badgeForm.status === 'earned' ? (editingItem?.badge?.earnedAt ?? '2026.04.22') : null,
    };

    setBadges((current) =>
      editingItem?.type === 'badge'
        ? current.map((badge) => (badge.id === editingItem.id ? nextBadge : badge))
        : [nextBadge, ...current],
    );
    resetForms();
  };

  const handleDeleteItem = (type, index) => {
    if (!window.confirm('이 항목을 삭제할까요?')) return;

    if (type === 'highlight') setHighlights((current) => current.filter((_, itemIndex) => itemIndex !== index));
    if (type === 'goal') setGoalSuggestions((current) => current.filter((_, itemIndex) => itemIndex !== index));
    if (type === 'activity') setActivities((current) => current.filter((_, itemIndex) => itemIndex !== index));
    resetForms();
  };

  const handleDeleteLevel = (levelId) => {
    if (levels.length <= 1) {
      window.alert('학습 레벨은 최소 1개 이상 필요합니다.');
      return;
    }

    if (!window.confirm('이 레벨 옵션을 삭제할까요?')) return;
    setLevels((current) => current.filter((level) => level.id !== levelId));
    resetForms();
  };

  const handleEditBadge = (badge) => {
    setActivePanel('badge');
    setEditingItem({ type: 'badge', id: badge.id, badge });
    setBadgeForm({
      name: badge.name,
      category: badge.category,
      imageUrl: badge.imageUrl,
      description: badge.description,
      condition: badge.condition,
      targetValue: String(badge.targetValue ?? 1),
      status: badge.status,
    });
    setBadgePreviewUrl(badge.imageUrl);
  };

  const handleDeleteBadge = (badgeId) => {
    if (!window.confirm('이 배지를 삭제할까요?')) return;
    setBadges((current) => current.filter((badge) => badge.id !== badgeId));
    resetForms();
  };

  const handleBadgeFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setBadgePreviewUrl(previewUrl);
    setBadgeForm((current) => ({
      ...current,
      imageUrl: current.imageUrl || `/assets/badges/${file.name}`,
    }));
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="성장 리포트 관리"
        description="성장 지표, 리포트 하이라이트, 레벨 옵션, 목표 제안, 학습 기록을 관리합니다."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/admin')}>
            관리자 메인으로
          </button>
        </div>
      </MapingoPageSection>

      <section className="mapingo-page-section">
        <div className="mapingo-dashboard-stats admin-overview-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="mapingo-stat-card admin-overview-card">
              <p className="mapingo-stat-label">{stat.label}</p>
              <strong className="mapingo-stat-value">{stat.value}</strong>
              <p className="mapingo-stat-hint">{stat.hint}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mapingo-page-section">
        <div className="admin-growth-member-panel">
          <div>
            <p className="mapingo-eyebrow">Member Report</p>
            <h3>{selectedMember?.name ?? '회원 선택'}</h3>
            <p>
              {selectedMember
                ? `${selectedMember.email} · ${selectedMember.plan} · ${selectedMember.level} · ${selectedMember.status}`
                : '성장 리포트를 관리할 회원을 선택하세요.'}
            </p>
          </div>
          <label className="mapingo-field admin-growth-member-select">
            <span className="mapingo-field-label">회원 선택</span>
            <select
              className="mapingo-input"
              value={selectedMemberId}
              onChange={(event) => {
                setSelectedMemberId(event.target.value);
                resetForms();
              }}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} · {member.email}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mapingo-admin-grid admin-content-layout admin-growth-layout">
          <div className="mapingo-form-card">
            <div className="mapingo-card-header-row admin-builder-head">
              <div>
                <h3>{editingItem ? '성장 리포트 항목 수정' : '성장 리포트 항목 관리'}</h3>
                <p className="mapingo-muted-copy">사용자 성장 리포트에 표시되는 운영 데이터를 조정합니다.</p>
              </div>
              <div className="admin-content-tab-row admin-growth-tabs">
                <button type="button" className={`admin-content-tab ${activePanel === 'summary' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('summary')}>요약</button>
                <button type="button" className={`admin-content-tab ${activePanel === 'highlight' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('highlight')}>하이라이트</button>
                <button type="button" className={`admin-content-tab ${activePanel === 'level' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('level')}>레벨</button>
                <button type="button" className={`admin-content-tab ${activePanel === 'goal' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('goal')}>목표</button>
                <button type="button" className={`admin-content-tab ${activePanel === 'activity' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('activity')}>기록</button>
                <button type="button" className={`admin-content-tab ${activePanel === 'badge' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('badge')}>배지 이미지</button>
              </div>
            </div>

            <section className={`admin-builder-section ${activePanel === 'summary' ? 'is-active' : ''}`}>
              <div className="mapingo-admin-form admin-builder-form">
                <div className="admin-content-form-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">발음 점수</span>
                    <input className="mapingo-input" type="number" min="0" max="100" value={summary.pronunciationScore} onChange={handleSummaryChange('pronunciationScore')} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">유창성 점수</span>
                    <input className="mapingo-input" type="number" min="0" max="100" value={summary.fluencyScore} onChange={handleSummaryChange('fluencyScore')} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">주간 학습 횟수</span>
                    <input className="mapingo-input" type="number" min="0" value={summary.weeklyLearnCount} onChange={handleSummaryChange('weeklyLearnCount')} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">연속 학습일</span>
                    <input className="mapingo-input" type="number" min="0" value={summary.streakDays} onChange={handleSummaryChange('streakDays')} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">배지 수</span>
                    <input className="mapingo-input" type="number" min="0" value={summary.badgeCount} onChange={handleSummaryChange('badgeCount')} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">현재 레벨</span>
                    <input className="mapingo-input" value={summary.currentLevel} onChange={handleSummaryChange('currentLevel')} />
                  </label>
                </div>
                <div className="admin-content-form-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">주간 목표</span>
                    <input className="mapingo-input" type="number" min="1" value={summary.weeklyGoal} onChange={handleSummaryChange('weeklyGoal')} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">이번 주 달성</span>
                    <input className="mapingo-input" type="number" min="0" max={summary.weeklyGoal} value={summary.weeklyGoalCompleted} onChange={handleSummaryChange('weeklyGoalCompleted')} />
                  </label>
                </div>
              </div>
            </section>

            <section className={`admin-builder-section ${activePanel === 'highlight' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleHighlightSubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">제목</span>
                  <input className="mapingo-input" value={highlightForm.title} onChange={(event) => setHighlightForm((current) => ({ ...current, title: event.target.value }))} required />
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">설명</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={highlightForm.description} onChange={(event) => setHighlightForm((current) => ({ ...current, description: event.target.value }))} required />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'highlight' ? '하이라이트 수정 저장' : '하이라이트 추가'}</button>
                  {editingItem?.type === 'highlight' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'level' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleLevelSubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">레벨명</span>
                  <input className="mapingo-input" value={levelForm.label} onChange={(event) => setLevelForm((current) => ({ ...current, label: event.target.value }))} required />
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">설명</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={levelForm.description} onChange={(event) => setLevelForm((current) => ({ ...current, description: event.target.value }))} required />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'level' ? '레벨 수정 저장' : '레벨 추가'}</button>
                  {editingItem?.type === 'level' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'goal' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleGoalSubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">목표 제안</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={goalForm} onChange={(event) => setGoalForm(event.target.value)} required />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'goal' ? '목표 수정 저장' : '목표 추가'}</button>
                  {editingItem?.type === 'goal' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'activity' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleActivitySubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">활동명</span>
                  <input className="mapingo-input" value={activityForm.label} onChange={(event) => setActivityForm((current) => ({ ...current, label: event.target.value }))} required />
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">시간/상태</span>
                  <input className="mapingo-input" value={activityForm.meta} onChange={(event) => setActivityForm((current) => ({ ...current, meta: event.target.value }))} required />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'activity' ? '기록 수정 저장' : '기록 추가'}</button>
                  {editingItem?.type === 'activity' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'badge' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleBadgeSubmit}>
                <div className="admin-growth-badge-editor">
                  <div className="admin-growth-badge-preview">
                    {(badgePreviewUrl || badgeForm.imageUrl) ? (
                      <img src={badgePreviewUrl || badgeForm.imageUrl} alt={badgeForm.name || '배지 이미지 미리보기'} />
                    ) : (
                      <span>Preview</span>
                    )}
                  </div>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">이미지 파일 미리보기</span>
                    <input className="mapingo-input" type="file" accept="image/*" onChange={handleBadgeFileSelect} />
                  </label>
                </div>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">배지명</span>
                  <input className="mapingo-input" value={badgeForm.name} onChange={(event) => setBadgeForm((current) => ({ ...current, name: event.target.value }))} required />
                </label>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">이미지 URL 또는 public 경로</span>
                  <input
                    className="mapingo-input"
                    value={badgeForm.imageUrl}
                    onChange={(event) => {
                      setBadgeForm((current) => ({ ...current, imageUrl: event.target.value }));
                      setBadgePreviewUrl('');
                    }}
                    placeholder="/assets/badges/first-trip.png"
                    required
                  />
                </label>

                <div className="admin-content-form-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">카테고리</span>
                    <select className="mapingo-input" value={badgeForm.category} onChange={(event) => setBadgeForm((current) => ({ ...current, category: event.target.value }))}>
                      {badgeCategoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">상태</span>
                    <select className="mapingo-input" value={badgeForm.status} onChange={(event) => setBadgeForm((current) => ({ ...current, status: event.target.value }))}>
                      {badgeStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">목표값</span>
                    <input className="mapingo-input" type="number" min="1" value={badgeForm.targetValue} onChange={(event) => setBadgeForm((current) => ({ ...current, targetValue: event.target.value }))} />
                  </label>
                </div>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">획득 조건</span>
                  <input className="mapingo-input" value={badgeForm.condition} onChange={(event) => setBadgeForm((current) => ({ ...current, condition: event.target.value }))} required />
                </label>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">설명</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={badgeForm.description} onChange={(event) => setBadgeForm((current) => ({ ...current, description: event.target.value }))} />
                </label>

                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'badge' ? '배지 수정 저장' : '배지 추가'}</button>
                  {editingItem?.type === 'badge' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>
          </div>

          <div className="mapingo-list-card">
            <div className="mapingo-card-header-row admin-result-head">
              <div>
                <h3>성장 리포트 구성</h3>
                <p className="mapingo-muted-copy">사용자 성장 리포트에 표시될 내용을 미리 확인하고 수정합니다.</p>
              </div>
              <span className="mapingo-inline-badge">{completionRate}% 달성</span>
            </div>

            <div className="admin-growth-preview">
              <strong>{selectedMember ? `${selectedMember.name}님의 성장 리포트` : summary.currentLevel}</strong>
              <p>
                {selectedMember
                  ? `${selectedMember.goal} · 최근 활동 ${selectedMember.lastActive}`
                  : `발음 ${summary.pronunciationScore}점 · 유창성 ${summary.fluencyScore}점`}
              </p>
              <p>발음 {summary.pronunciationScore}점 · 유창성 {summary.fluencyScore}점 · 배지 {badges.length}개</p>
              <div className="growth-comparison-track" aria-hidden="true">
                <span className="growth-comparison-fill" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <div className="admin-entity-stack admin-growth-stack">
              <section className="admin-entity-section">
                <div className="admin-entity-head"><strong>배지 이미지</strong><span>{badges.length}개</span></div>
                <div className="mapingo-selectable-list">
                  {badges.map((badge) => (
                    <article key={badge.id} className="mapingo-post-card admin-content-card admin-growth-badge-card">
                      <div className="admin-growth-badge-card-media">
                        <img src={badge.imageUrl} alt={badge.name} />
                      </div>
                      <div className="admin-growth-badge-card-copy">
                        <div className="mapingo-admin-item-head">
                          <div>
                            <strong>{badge.name}</strong>
                            <p>{badge.description}</p>
                          </div>
                          <span className="mapingo-inline-badge">{badge.category}</span>
                        </div>
                        <div className="admin-content-tags">
                          <span>{badge.condition}</span>
                          <span>{badge.status}</span>
                          <span>{badge.imageUrl}</span>
                        </div>
                        <div className="mapingo-admin-action-row admin-content-card-actions">
                          <button type="button" className="mapingo-submit-button" onClick={() => handleEditBadge(badge)}>수정</button>
                          <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteBadge(badge.id)}>삭제</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-entity-section">
                <div className="admin-entity-head"><strong>성장 하이라이트</strong><span>{highlights.length}개</span></div>
                <div className="mapingo-selectable-list">
                  {highlights.map((highlight, index) => (
                    <article key={`${highlight.title}-${index}`} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head"><div><strong>{highlight.title}</strong><p>{highlight.description}</p></div></div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => { setActivePanel('highlight'); setEditingItem({ type: 'highlight', index }); setHighlightForm(highlight); }}>수정</button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteItem('highlight', index)}>삭제</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-entity-section">
                <div className="admin-entity-head"><strong>레벨 옵션</strong><span>{levels.length}개</span></div>
                <div className="mapingo-selectable-list">
                  {levels.map((level) => (
                    <article key={level.id} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head"><div><strong>{level.label}</strong><p>{level.description}</p></div><span className="mapingo-inline-badge">{level.id}</span></div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => { setActivePanel('level'); setEditingItem({ type: 'level', id: level.id }); setLevelForm({ label: level.label, description: level.description }); }}>수정</button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteLevel(level.id)}>삭제</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-entity-section">
                <div className="admin-entity-head"><strong>목표 제안</strong><span>{goalSuggestions.length}개</span></div>
                <div className="mapingo-selectable-list">
                  {goalSuggestions.map((goal, index) => (
                    <article key={`${goal}-${index}`} className="mapingo-post-card admin-content-card">
                      <p className="admin-content-description">{goal}</p>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => { setActivePanel('goal'); setEditingItem({ type: 'goal', index }); setGoalForm(goal); }}>수정</button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteItem('goal', index)}>삭제</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-entity-section">
                <div className="admin-entity-head"><strong>학습 활동 기록</strong><span>{activities.length}개</span></div>
                <div className="mapingo-selectable-list">
                  {activities.map((activity, index) => (
                    <article key={`${activity.label}-${index}`} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head"><div><strong>{activity.label}</strong><p>{activity.meta}</p></div></div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => { setActivePanel('activity'); setEditingItem({ type: 'activity', index }); setActivityForm(activity); }}>수정</button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteItem('activity', index)}>삭제</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminGrowthPage;
