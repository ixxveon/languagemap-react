import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { useMapingoStore } from '../../store/useMapingoStore';

function GrowthInsightsPage() {
  const navigate = useNavigate();
  const recentLearning = useMapingoStore((state) => state.recentLearning);
  const currentLevel = useMapingoStore((state) => state.currentLevel);
  const currentLevelId = useMapingoStore((state) => state.currentLevelId);
  const weeklyGoal = useMapingoStore((state) => state.weeklyGoal);
  const weeklyGoalCompleted = useMapingoStore((state) => state.weeklyGoalCompleted);
  const notificationsEnabled = useMapingoStore((state) => state.notificationsEnabled);
  const studyTime = useMapingoStore((state) => state.studyTime);
  const setCurrentLevel = useMapingoStore((state) => state.setCurrentLevel);
  const setWeeklyGoal = useMapingoStore((state) => state.setWeeklyGoal);
  const setWeeklyGoalCompleted = useMapingoStore((state) => state.setWeeklyGoalCompleted);
  const setNotificationsEnabled = useMapingoStore((state) => state.setNotificationsEnabled);
  const setStudyTime = useMapingoStore((state) => state.setStudyTime);
  const levelOptions = [
    { id: 'starter', label: '초급 시작', description: '짧은 질문과 기본 응답을 익히는 단계' },
    { id: 'basic', label: '초급 확장', description: '주문, 이동, 쇼핑 표현을 조금 더 길게 이어가는 단계' },
    { id: 'intermediate', label: '중급 진입', description: '상황 설명과 추가 질문까지 자연스럽게 이어가는 단계' },
    { id: 'advanced', label: '고급 도전', description: '긴 대화와 즉흥 응답을 유연하게 이어가는 단계' },
  ];
  const selectedLevel = levelOptions.find((option) => option.id === currentLevelId);
  const completionRate = Math.min(100, Math.round((weeklyGoalCompleted / Number(weeklyGoal || 1)) * 100));

  const learningTimeline = useMemo(
    () =>
      recentLearning.map((item, index) => ({
        id: item.id,
        part: item.title,
        time: item.meta,
        summary: item.description,
        status: index === 0 ? '방금 완료' : index === 1 ? '복습 완료' : '학습 기록',
      })),
    [recentLearning],
  );

  const partProgress = [
    {
      title: '카페 주문 파트',
      progress: 100,
      step: '주문 변경 · 사이즈 확인까지 완료',
      note: '실전 루트 학습을 마쳤어요.',
    },
    {
      title: '공항 입국 심사 파트',
      progress: 72,
      step: '질문 응답 흐름까지 학습',
      note: '추가 질문 대응만 남아 있어요.',
    },
    {
      title: '스몰토크 표현 파트',
      progress: 54,
      step: '기본 문장 연결까지 진행',
      note: '자연스럽게 이어 말하기를 더 연습하면 좋아요.',
    },
  ];

  const overviewItems = [
    { label: '현재 레벨', value: currentLevel, detail: '현재 학습 단계' },
    { label: '주간 목표', value: `${weeklyGoalCompleted}/${weeklyGoal}회`, detail: '이번 주 완료 횟수' },
    { label: '최근 완료', value: learningTimeline[0]?.part ?? '기록 없음', detail: learningTimeline[0]?.time ?? '최근 기록 없음' },
  ];

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="성장 리포트"
        title="학습 설정 · 기록 현황"
        description="학습 설정을 조정하고, 어떤 파트를 언제 완료했는지와 현재 진행 상태를 한눈에 확인할 수 있어요."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/growth')}>
            성장 리포트 메인으로
          </button>
        </div>
      </MapingoPageSection>

      <div className="growth-insights-layout">
        <section className="growth-insights-panel">
          <div className="growth-panel-head">
            <div>
              <p className="growth-panel-kicker">학습 설정 바로 조정</p>
              <h3>기록을 확인하기 전에 레벨, 목표, 알림을 먼저 맞출 수 있어요.</h3>
            </div>
          </div>

          <div className="mapingo-goals-control-grid growth-insights-goals-grid">
            <article className="mapingo-form-card mapingo-goals-section-card">
              <div className="mapingo-goals-section-head">
                <div>
                  <p className="mapingo-goals-kicker">1. 레벨 설정</p>
                  <h3>현재 학습 단계</h3>
                </div>
                <span className="mapingo-goals-section-tip">학습 난이도 기준</span>
              </div>
              <label className="mapingo-field">
                <span className="mapingo-field-label">현재 레벨</span>
                <select
                  className="mapingo-select"
                  value={currentLevelId}
                  onChange={(event) => {
                    const selected = levelOptions.find((option) => option.id === event.target.value);
                    if (selected) {
                      setCurrentLevel({ id: selected.id, label: selected.label });
                    }
                  }}
                >
                  {levelOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mapingo-goals-helper">{selectedLevel?.description ?? `${currentLevel} 단계예요.`}</p>
            </article>

            <article className="mapingo-form-card mapingo-goals-section-card">
              <div className="mapingo-goals-section-head">
                <div>
                  <p className="mapingo-goals-kicker">2. 목표 설정</p>
                  <h3>주간 학습 목표</h3>
                </div>
                <span className="mapingo-goals-section-tip">주간 루틴 기준</span>
              </div>

              <label className="mapingo-field">
                <span className="mapingo-field-label">주간 목표</span>
                <select
                  className="mapingo-select"
                  value={weeklyGoal}
                  onChange={(event) => setWeeklyGoal(event.target.value)}
                >
                  <option value="3">주 3회</option>
                  <option value="5">주 5회</option>
                  <option value="7">매일</option>
                </select>
              </label>

              <label className="mapingo-field">
                <span className="mapingo-field-label">이번 주 달성 횟수</span>
                <input
                  className="mapingo-range-input"
                  type="range"
                  min="0"
                  max={weeklyGoal}
                  value={weeklyGoalCompleted}
                  style={{ '--range-progress': `${completionRate}%` }}
                  onChange={(event) => setWeeklyGoalCompleted(Number(event.target.value))}
                />
              </label>

              <div className="mapingo-goals-range-scale" aria-hidden="true">
                <span>0회</span>
                <span>{`${weeklyGoal}회`}</span>
              </div>
            </article>

            <article className="mapingo-form-card mapingo-goals-section-card">
              <div className="mapingo-goals-section-head">
                <div>
                  <p className="mapingo-goals-kicker">3. 알림 설정</p>
                  <h3>학습 리마인드</h3>
                </div>
                <span className="mapingo-goals-section-tip">루틴 유지 도우미</span>
              </div>

              <label className="mapingo-goals-toggle-card">
                <div>
                  <span className="mapingo-field-label">학습 알림 활성화</span>
                  <p className="mapingo-goals-helper">
                    {notificationsEnabled ? '정해진 시간에 학습 리마인드를 받을 수 있어요.' : '필요할 때 다시 켜서 루틴을 유지할 수 있어요.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(event) => setNotificationsEnabled(event.target.checked)}
                />
              </label>

              <label className="mapingo-field">
                <span className="mapingo-field-label">알림 시간</span>
                <input
                  className="mapingo-input"
                  type="time"
                  value={studyTime}
                  onChange={(event) => setStudyTime(event.target.value)}
                />
              </label>
            </article>
          </div>

          <div className="mapingo-inline-badges mapingo-goals-badges">
            <span className="mapingo-inline-badge">{currentLevel}</span>
            <span className="mapingo-inline-badge">{`주간 목표 ${weeklyGoal}회`}</span>
            <span className="mapingo-inline-badge">{`현재 ${weeklyGoalCompleted}회 완료`}</span>
            <span className="mapingo-inline-badge">
              {notificationsEnabled ? `알림 ${studyTime}` : '알림 꺼짐'}
            </span>
          </div>
        </section>

        <section className="growth-insights-overview">
          <div className="growth-panel-head">
            <div>
              <p className="growth-panel-kicker">학습 요약</p>
              <h3>최근 완료한 학습과 현재 진행 상태를 바로 확인하세요.</h3>
            </div>
          </div>

          <div className="growth-insights-overview-grid">
            {overviewItems.map((item) => (
              <article key={item.label} className="growth-insights-overview-card">
                <p className="growth-score-label">{item.label}</p>
                <strong className="growth-score-value">{item.value}</strong>
                <p className="growth-score-detail">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="growth-insights-content">
          <section className="growth-insights-panel">
            <div className="growth-panel-head">
              <div>
                <p className="growth-panel-kicker">학습 완료 기록</p>
                <h3>언제 어떤 파트를 끝냈는지 시간순으로 볼 수 있어요.</h3>
              </div>
            </div>

            <div className="growth-learning-timeline">
              {learningTimeline.map((item) => (
                <article key={item.id} className="growth-learning-timeline-item">
                  <div className="growth-learning-timeline-dot" aria-hidden="true" />
                  <div className="growth-learning-timeline-copy">
                    <div className="growth-learning-timeline-head">
                      <div>
                        <h4>{item.part}</h4>
                        <p className="growth-learning-timeline-time">{item.time}</p>
                      </div>
                      <span className="growth-highlight-badge">{item.status}</span>
                    </div>
                    <p className="growth-learning-timeline-summary">{item.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="growth-insights-panel">
            <div className="growth-panel-head">
              <div>
                <p className="growth-panel-kicker">파트별 진행도</p>
                <h3>현재 어디까지 학습했는지 파트별로 구분해서 보여줘요.</h3>
              </div>
            </div>

            <div className="growth-part-progress-list">
              {partProgress.map((part) => (
                <article key={part.title} className="growth-part-progress-item">
                  <div className="growth-comparison-head">
                    <p>{part.title}</p>
                    <strong>{part.progress}%</strong>
                  </div>
                  <p className="growth-part-progress-step">{part.step}</p>
                  <div className="growth-comparison-track" aria-hidden="true">
                    <span className="growth-comparison-fill" style={{ width: `${part.progress}%` }} />
                  </div>
                  <p className="growth-comparison-copy">{part.note}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default GrowthInsightsPage;
