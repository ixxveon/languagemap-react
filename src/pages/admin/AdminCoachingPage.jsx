import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminService } from '../../api/adminService';

const emptyModeForm = {
  label: '',
  description: '',
};

const emptyScenarioForm = {
  modeId: '',
  title: '',
  goal: '',
  prompt: '',
  keySentences: '',
};

const emptySentenceForm = {
  sentence: '',
  score: '80',
  accuracy: '80%',
  errorWords: '',
  feedback: '',
};

const emptyVideoForm = {
  title: '',
  channel: '',
  length: '',
  description: '',
  thumbnail: '',
};

function splitList(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

function AdminCoachingPage() {
  const navigate = useNavigate();
  const initialModes = adminService.fetchAdminCoachingModes();
  const [modes, setModes] = useState(() => initialModes);
  const [scenarios, setScenarios] = useState(() => adminService.fetchAdminCoachingScenarios());
  const [evaluation, setEvaluation] = useState(() => adminService.fetchAdminCoachingEvaluation());
  const [sentences, setSentences] = useState(() => adminService.fetchAdminCoachingPronunciationSentences());
  const [videos, setVideos] = useState(() => adminService.fetchAdminCoachingRecommendations());
  const [activePanel, setActivePanel] = useState('mode');
  const [editingItem, setEditingItem] = useState(null);
  const [modeForm, setModeForm] = useState(emptyModeForm);
  const [scenarioForm, setScenarioForm] = useState(() => ({
    ...emptyScenarioForm,
    modeId: initialModes[0]?.id ?? '',
  }));
  const [sentenceForm, setSentenceForm] = useState(emptySentenceForm);
  const [videoForm, setVideoForm] = useState(emptyVideoForm);

  const scenarioRows = useMemo(
    () =>
      modes.map((mode) => ({
        mode,
        scenario: scenarios[mode.id],
      })),
    [modes, scenarios],
  );

  const stats = [
    { label: '코칭 모드', value: modes.length, hint: '사용자 선택 카드' },
    { label: '연습 시나리오', value: scenarioRows.filter((row) => row.scenario).length, hint: '모드별 프롬프트' },
    { label: '발음 문장', value: sentences.length, hint: '완료 후 복습 문장' },
    { label: '추천 영상', value: videos.length, hint: 'YouTube 추천 카드' },
  ];

  const resetForms = () => {
    setEditingItem(null);
    setModeForm(emptyModeForm);
    setScenarioForm({
      ...emptyScenarioForm,
      modeId: modes[0]?.id ?? '',
    });
    setSentenceForm(emptySentenceForm);
    setVideoForm(emptyVideoForm);
  };

  const handlePanelSelect = (panel) => {
    setActivePanel(panel);
    resetForms();
  };

  const handleModeSubmit = (event) => {
    event.preventDefault();
    const label = modeForm.label.trim();
    const description = modeForm.description.trim();

    if (!label || !description) return;

    if (editingItem?.type === 'mode') {
      setModes((currentModes) =>
        currentModes.map((mode) => (mode.id === editingItem.id ? { ...mode, label, description } : mode)),
      );
      resetForms();
      return;
    }

    const nextId = label
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-|-$/g, '');

    const uniqueId = nextId && !modes.some((mode) => mode.id === nextId) ? nextId : `mode-${Date.now()}`;
    setModes((currentModes) => [...currentModes, { id: uniqueId, label, description }]);
    setScenarios((currentScenarios) => ({
      ...currentScenarios,
      [uniqueId]: {
        title: `${label} 시나리오`,
        goal: '관리자에서 목표를 입력해 주세요.',
        prompt: '관리자에서 코칭 프롬프트를 입력해 주세요.',
        keySentences: [],
      },
    }));
    resetForms();
  };

  const handleScenarioSubmit = (event) => {
    event.preventDefault();
    const modeId = scenarioForm.modeId;
    if (!modeId || !scenarioForm.title.trim() || !scenarioForm.prompt.trim()) return;

    setScenarios((currentScenarios) => ({
      ...currentScenarios,
      [modeId]: {
        title: scenarioForm.title.trim(),
        goal: scenarioForm.goal.trim(),
        prompt: scenarioForm.prompt.trim(),
        keySentences: splitList(scenarioForm.keySentences),
      },
    }));
    resetForms();
  };

  const handleSentenceSubmit = (event) => {
    event.preventDefault();
    if (!sentenceForm.sentence.trim() || !sentenceForm.feedback.trim()) return;

    const nextSentence = {
      id: editingItem?.type === 'sentence' ? editingItem.id : Math.max(0, ...sentences.map((sentence) => sentence.id)) + 1,
      sentence: sentenceForm.sentence.trim(),
      score: Number(sentenceForm.score),
      accuracy: sentenceForm.accuracy.trim(),
      errorWords: sentenceForm.errorWords
        .split(',')
        .map((word) => word.trim())
        .filter(Boolean),
      feedback: sentenceForm.feedback.trim(),
    };

    setSentences((currentSentences) =>
      editingItem?.type === 'sentence'
        ? currentSentences.map((sentence) => (sentence.id === editingItem.id ? nextSentence : sentence))
        : [nextSentence, ...currentSentences],
    );
    resetForms();
  };

  const handleVideoSubmit = (event) => {
    event.preventDefault();
    if (!videoForm.title.trim() || !videoForm.channel.trim()) return;

    const nextVideo = {
      id: editingItem?.type === 'video' ? editingItem.id : Math.max(0, ...videos.map((video) => video.id)) + 1,
      title: videoForm.title.trim(),
      channel: videoForm.channel.trim(),
      length: videoForm.length.trim(),
      description: videoForm.description.trim(),
      thumbnail: videoForm.thumbnail.trim() || 'VIDEO',
    };

    setVideos((currentVideos) =>
      editingItem?.type === 'video'
        ? currentVideos.map((video) => (video.id === editingItem.id ? nextVideo : video))
        : [nextVideo, ...currentVideos],
    );
    resetForms();
  };

  const handleEditMode = (mode) => {
    setActivePanel('mode');
    setEditingItem({ type: 'mode', id: mode.id });
    setModeForm({ label: mode.label, description: mode.description });
  };

  const handleEditScenario = (modeId, scenario) => {
    setActivePanel('scenario');
    setEditingItem({ type: 'scenario', id: modeId });
    setScenarioForm({
      modeId,
      title: scenario.title,
      goal: scenario.goal,
      prompt: scenario.prompt,
      keySentences: joinList(scenario.keySentences),
    });
  };

  const handleEditSentence = (sentence) => {
    setActivePanel('sentence');
    setEditingItem({ type: 'sentence', id: sentence.id });
    setSentenceForm({
      sentence: sentence.sentence,
      score: String(sentence.score),
      accuracy: sentence.accuracy,
      errorWords: sentence.errorWords.join(', '),
      feedback: sentence.feedback,
    });
  };

  const handleEditVideo = (video) => {
    setActivePanel('video');
    setEditingItem({ type: 'video', id: video.id });
    setVideoForm({
      title: video.title,
      channel: video.channel,
      length: video.length,
      description: video.description,
      thumbnail: video.thumbnail,
    });
  };

  const handleDeleteMode = (modeId) => {
    if (modes.length <= 1) {
      window.alert('코칭 모드는 최소 1개 이상 필요합니다.');
      return;
    }

    if (!window.confirm('이 코칭 모드와 연결된 시나리오를 삭제할까요?')) return;

    setModes((currentModes) => currentModes.filter((mode) => mode.id !== modeId));
    setScenarios((currentScenarios) => {
      const nextScenarios = { ...currentScenarios };
      delete nextScenarios[modeId];
      return nextScenarios;
    });
    resetForms();
  };

  const handleDeleteSentence = (sentenceId) => {
    if (!window.confirm('이 발음 문장을 삭제할까요?')) return;
    setSentences((currentSentences) => currentSentences.filter((sentence) => sentence.id !== sentenceId));
    resetForms();
  };

  const handleDeleteVideo = (videoId) => {
    if (!window.confirm('이 추천 영상을 삭제할까요?')) return;
    setVideos((currentVideos) => currentVideos.filter((video) => video.id !== videoId));
    resetForms();
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="AI 코칭 관리"
        description="AI 코칭 모드, 모드별 프롬프트, 발음 복습 문장, 추천 영상을 한 화면에서 관리합니다."
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
        <div className="mapingo-admin-grid admin-content-layout admin-coaching-layout">
          <div className="mapingo-form-card">
            <div className="mapingo-card-header-row admin-builder-head">
              <div>
                <h3>{editingItem ? '코칭 항목 수정' : '코칭 항목 생성'}</h3>
                <p className="mapingo-muted-copy">탭을 선택해 코칭 화면에 표시될 콘텐츠를 관리하세요.</p>
              </div>
              <div className="admin-content-tab-row admin-coaching-tabs">
                <button type="button" className={`admin-content-tab ${activePanel === 'mode' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('mode')}>
                  모드
                </button>
                <button type="button" className={`admin-content-tab ${activePanel === 'scenario' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('scenario')}>
                  시나리오
                </button>
                <button type="button" className={`admin-content-tab ${activePanel === 'sentence' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('sentence')}>
                  발음 문장
                </button>
                <button type="button" className={`admin-content-tab ${activePanel === 'video' ? 'is-active' : ''}`} onClick={() => handlePanelSelect('video')}>
                  추천 영상
                </button>
              </div>
            </div>

            <section className={`admin-builder-section ${activePanel === 'mode' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleModeSubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">모드명</span>
                  <input className="mapingo-input" value={modeForm.label} onChange={(event) => setModeForm((current) => ({ ...current, label: event.target.value }))} required />
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">설명</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={modeForm.description} onChange={(event) => setModeForm((current) => ({ ...current, description: event.target.value }))} required />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'mode' ? '모드 수정 저장' : '모드 추가'}</button>
                  {editingItem?.type === 'mode' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'scenario' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleScenarioSubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">연결 모드</span>
                  <select className="mapingo-input" value={scenarioForm.modeId} onChange={(event) => setScenarioForm((current) => ({ ...current, modeId: event.target.value }))}>
                    {modes.map((mode) => <option key={mode.id} value={mode.id}>{mode.label}</option>)}
                  </select>
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">시나리오 제목</span>
                  <input className="mapingo-input" value={scenarioForm.title} onChange={(event) => setScenarioForm((current) => ({ ...current, title: event.target.value }))} required />
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">목표</span>
                  <input className="mapingo-input" value={scenarioForm.goal} onChange={(event) => setScenarioForm((current) => ({ ...current, goal: event.target.value }))} />
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">AI 코칭 프롬프트</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={scenarioForm.prompt} onChange={(event) => setScenarioForm((current) => ({ ...current, prompt: event.target.value }))} required />
                </label>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">핵심 문장</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={scenarioForm.keySentences} onChange={(event) => setScenarioForm((current) => ({ ...current, keySentences: event.target.value }))} placeholder="문장별로 줄바꿈해서 입력" />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">시나리오 저장</button>
                  {editingItem?.type === 'scenario' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'sentence' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleSentenceSubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">복습 문장</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={sentenceForm.sentence} onChange={(event) => setSentenceForm((current) => ({ ...current, sentence: event.target.value }))} required />
                </label>
                <div className="admin-content-form-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">점수</span>
                    <input className="mapingo-input" type="number" min="0" max="100" value={sentenceForm.score} onChange={(event) => setSentenceForm((current) => ({ ...current, score: event.target.value }))} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">정확도</span>
                    <input className="mapingo-input" value={sentenceForm.accuracy} onChange={(event) => setSentenceForm((current) => ({ ...current, accuracy: event.target.value }))} />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">오류 단어</span>
                    <input className="mapingo-input" value={sentenceForm.errorWords} onChange={(event) => setSentenceForm((current) => ({ ...current, errorWords: event.target.value }))} placeholder="쉼표로 구분" />
                  </label>
                </div>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">피드백</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={sentenceForm.feedback} onChange={(event) => setSentenceForm((current) => ({ ...current, feedback: event.target.value }))} required />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'sentence' ? '문장 수정 저장' : '문장 추가'}</button>
                  {editingItem?.type === 'sentence' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'video' ? 'is-active' : ''}`}>
              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleVideoSubmit}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">영상 제목</span>
                  <input className="mapingo-input" value={videoForm.title} onChange={(event) => setVideoForm((current) => ({ ...current, title: event.target.value }))} required />
                </label>
                <div className="admin-content-form-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">채널</span>
                    <input className="mapingo-input" value={videoForm.channel} onChange={(event) => setVideoForm((current) => ({ ...current, channel: event.target.value }))} required />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">길이</span>
                    <input className="mapingo-input" value={videoForm.length} onChange={(event) => setVideoForm((current) => ({ ...current, length: event.target.value }))} placeholder="예: 8:42" />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">썸네일 라벨</span>
                    <input className="mapingo-input" value={videoForm.thumbnail} onChange={(event) => setVideoForm((current) => ({ ...current, thumbnail: event.target.value }))} placeholder="예: CAFE" />
                  </label>
                </div>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">설명</span>
                  <textarea className="mapingo-input mapingo-admin-textarea" value={videoForm.description} onChange={(event) => setVideoForm((current) => ({ ...current, description: event.target.value }))} />
                </label>
                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">{editingItem?.type === 'video' ? '영상 수정 저장' : '영상 추가'}</button>
                  {editingItem?.type === 'video' ? <button type="button" className="mapingo-ghost-button" onClick={resetForms}>취소</button> : null}
                </div>
              </form>
            </section>
          </div>

          <div className="mapingo-list-card">
            <div className="mapingo-card-header-row admin-result-head">
              <div>
                <h3>코칭 구성</h3>
                <p className="mapingo-muted-copy">사용자 AI 코칭 페이지에 표시되는 운영 데이터를 확인하고 수정합니다.</p>
              </div>
              <span className="mapingo-inline-badge">평균 {evaluation.score}점</span>
            </div>

            <div className="admin-coaching-evaluation">
              <strong>평가 요약</strong>
              <textarea
                className="mapingo-input mapingo-admin-textarea"
                value={evaluation.summary}
                onChange={(event) => setEvaluation((current) => ({ ...current, summary: event.target.value }))}
              />
              <label className="mapingo-field">
                <span className="mapingo-field-label">다음 집중 목표</span>
                <input className="mapingo-input" value={evaluation.nextFocus} onChange={(event) => setEvaluation((current) => ({ ...current, nextFocus: event.target.value }))} />
              </label>
            </div>

            <div className="admin-entity-stack admin-coaching-stack">
              <section className="admin-entity-section">
                <div className="admin-entity-head">
                  <strong>코칭 모드와 시나리오</strong>
                  <span>{modes.length}개</span>
                </div>
                <div className="mapingo-selectable-list">
                  {scenarioRows.map(({ mode, scenario }) => (
                    <article key={mode.id} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{mode.label}</strong>
                          <p>{mode.description}</p>
                        </div>
                        <span className="mapingo-inline-badge">{mode.id}</span>
                      </div>
                      {scenario ? (
                        <>
                          <p className="admin-content-description">{scenario.title} · {scenario.goal}</p>
                          <div className="admin-content-tags">
                            {scenario.keySentences.map((sentence) => <span key={sentence}>{sentence}</span>)}
                          </div>
                        </>
                      ) : null}
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => handleEditMode(mode)}>모드 수정</button>
                        {scenario ? <button type="button" className="mapingo-ghost-button" onClick={() => handleEditScenario(mode.id, scenario)}>시나리오 수정</button> : null}
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteMode(mode.id)}>삭제</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-entity-section">
                <div className="admin-entity-head">
                  <strong>발음 복습 문장</strong>
                  <span>{sentences.length}개</span>
                </div>
                <div className="mapingo-selectable-list">
                  {sentences.map((sentence) => (
                    <article key={sentence.id} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{sentence.sentence}</strong>
                          <p>{sentence.feedback}</p>
                        </div>
                        <span className="mapingo-inline-badge">{sentence.score}점</span>
                      </div>
                      <div className="admin-content-tags">
                        <span>정확도 {sentence.accuracy}</span>
                        {sentence.errorWords.map((word) => <span key={word}>{word}</span>)}
                      </div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => handleEditSentence(sentence)}>수정</button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteSentence(sentence.id)}>삭제</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-entity-section">
                <div className="admin-entity-head">
                  <strong>추천 영상</strong>
                  <span>{videos.length}개</span>
                </div>
                <div className="mapingo-selectable-list">
                  {videos.map((video) => (
                    <article key={video.id} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{video.title}</strong>
                          <p>{video.channel} · {video.length}</p>
                        </div>
                        <span className="mapingo-inline-badge">{video.thumbnail}</span>
                      </div>
                      <p className="admin-content-description">{video.description}</p>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => handleEditVideo(video)}>수정</button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteVideo(video.id)}>삭제</button>
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

export default AdminCoachingPage;
