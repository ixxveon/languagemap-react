import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { useMapingoStore } from '../../store/useMapingoStore';
import { learningService } from '../../api/learningService';

function buildPolylinePoints(values) {
  const width = 240;
  const height = 88;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(' ');
}

function buildAreaPath(values) {
  const width = 240;
  const height = 88;
  const points = buildPolylinePoints(values);

  return `M 0 ${height} L ${points
    .split(' ')
    .map((point) => point.replace(',', ' '))
    .join(' L ')} L ${width} ${height} Z`;
}

function TrendSparkline({ values }) {
  const points = buildPolylinePoints(values);
  const areaPath = buildAreaPath(values);
  const lastPoint = points.split(' ').at(-1)?.split(',') ?? ['240', '44'];

  return (
    <svg className="growth-sparkline" viewBox="0 0 240 88" aria-hidden="true">
      <defs>
        <linearGradient id="growthSparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(41, 183, 168, 0.26)" />
          <stop offset="100%" stopColor="rgba(41, 183, 168, 0.02)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#growthSparkFill)" />
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="5" fill="currentColor" />
    </svg>
  );
}

function getBadgeCategoryLabel(category) {
  if (category === 'pronunciation') return '발음';
  if (category === 'goal') return '목표';
  if (category === 'growth') return '성장';
  if (category === 'learning') return '학습';
  if (category === 'streak') return '루틴';
  return '배지';
}

function GrowthProgressPage() {
  const navigate = useNavigate();
  const pronunciationScore = useMapingoStore((state) => state.pronunciationScore);
  const fluencyScore = useMapingoStore((state) => state.fluencyScore);
  const weeklyLearnCount = useMapingoStore((state) => state.weeklyLearnCount);
  const recentLearning = useMapingoStore((state) => state.recentLearning);
  const weeklyGoalCompleted = useMapingoStore((state) => state.weeklyGoalCompleted);
  const weeklyGoal = useMapingoStore((state) => state.weeklyGoal);
  const learningStreak = useMapingoStore((state) => state.streakDays);
  const storedBadgeProgress = useMapingoStore((state) => state.badgeProgress);
  const highlights = learningService.fetchGrowthHighlights();
  const badgeProgress = useMemo(
    () =>
      learningService.buildBadgeProgressFromStore({
        recentLearning,
        weeklyLearnCount,
        weeklyGoalCompleted,
        weeklyGoal,
        learningStreak,
        badgeProgress: storedBadgeProgress,
      }),
    [recentLearning, weeklyLearnCount, weeklyGoalCompleted, weeklyGoal, learningStreak, storedBadgeProgress],
  );
  const badgeCatalog = useMemo(() => learningService.fetchBadgeCatalog(badgeProgress), [badgeProgress]);
  const earnedBadges = badgeCatalog.filter((badge) => badge.status === 'earned');
  const featuredBadge = earnedBadges[0];
  const badgeShowcase = earnedBadges.slice(0, 4);

  const comparisonItems = [
    { label: '발음 안정감', score: pronunciationScore, summary: '발음 흔들림이 빠르게 줄고 있어요.' },
    { label: '응답 연결력', score: fluencyScore, summary: '짧은 대화에서 끊김이 덜해졌어요.' },
    { label: '학습 루틴', score: Math.min(100, Math.round((weeklyLearnCount / 15) * 100)), summary: '이번 주 목표 달성까지 3회 남았어요.' },
  ];

  const weeklyBars = [
    { day: '월', value: 1 },
    { day: '화', value: 2 },
    { day: '수', value: 1 },
    { day: '목', value: 3 },
    { day: '금', value: 2 },
    { day: '토', value: 1 },
    { day: '일', value: 2 },
  ];
  const maxWeeklyValue = Math.max(...weeklyBars.map((item) => item.value));
  const highlightCards = [
    {
      title: '발음 점수 변화',
      badge: '+6점',
      description: highlights[0]?.description,
      progress: 89,
      tone: 'improving',
      stats: [
        { label: '정확도', value: '89%' },
        { label: '안정감', value: '상승' },
      ],
      values: [74, 76, 80, 79, 84, 87, 89],
    },
    {
      title: '유창성 점수',
      badge: '+4점',
      description: highlights[1]?.description,
      progress: 84,
      tone: 'steady',
      stats: [
        { label: '연결 문장', value: '68%' },
        { label: '머뭇거림', value: '감소' },
      ],
      values: [66, 68, 71, 70, 77, 80, 84],
    },
    {
      title: '다음 목표',
      badge: '2회 남음',
      description: highlights[2]?.description,
      progress: 78,
      tone: 'goal',
      stats: [
        { label: '주간 목표', value: '78%' },
        { label: '남은 루트', value: '2개' },
      ],
      values: [42, 48, 55, 61, 66, 72, 78],
    },
  ];

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection eyebrow="성장 리포트" title="성장 지표" description="점수 변화와 학습 리듬을 그래프로 정리해서 바로 이해할 수 있게 구성했어요.">
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/growth')}>
            성장 리포트 메인으로
          </button>
        </div>

        <div className="growth-progress-layout">
          <section className="growth-score-panel">
            <div className="growth-panel-head">
              <div>
                <p className="growth-panel-kicker">획득한 배지</p>
                <h3>최근 성장을 배지로 확인하고 성취를 한눈에 살펴보세요.</h3>
              </div>
              <p className="growth-panel-caption">{earnedBadges.length}개 획득</p>
            </div>

            {featuredBadge ? (
              <>
                <article className="growth-badge-featured-card">
                  <div className="growth-badge-featured-media">
                    <img src={featuredBadge.imageUrl} alt={featuredBadge.name} className="growth-badge-featured-image" />
                  </div>
                  <div className="growth-badge-featured-copy">
                    <div className="growth-score-card-head">
                      <p className="growth-score-label">{getBadgeCategoryLabel(featuredBadge.category)} 배지</p>
                      <span className="growth-score-chip">획득 완료</span>
                    </div>
                    <strong className="growth-score-value">{featuredBadge.name}</strong>
                    <p className="growth-score-helper">{featuredBadge.description}</p>
                    <p className="growth-score-detail">
                      {featuredBadge.condition} · {featuredBadge.earnedAt}
                    </p>
                  </div>
                </article>

                <div className="growth-badge-grid">
                  {badgeShowcase.map((badge) => (
                    <article key={badge.id} className="growth-badge-card">
                      <div className="growth-badge-card-media">
                        <img src={badge.imageUrl} alt={badge.name} className="growth-badge-card-image" />
                      </div>
                      <div className="growth-badge-card-copy">
                        <p className="growth-score-label">{getBadgeCategoryLabel(badge.category)}</p>
                        <h4>{badge.name}</h4>
                        <p>{badge.condition}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <article className="growth-empty-badge-card">
                <p className="growth-score-helper">아직 획득한 배지가 없어요.</p>
                <p className="growth-score-detail">학습과 목표 달성을 이어가면 이 공간에 배지가 차곡차곡 쌓이게 됩니다.</p>
              </article>
            )}
          </section>

          <section className="growth-insight-panel">
            <div className="growth-panel-head">
              <div>
                <p className="growth-panel-kicker">한눈에 보는 분석</p>
                <h3>어디가 강해졌는지 막대로 비교해봤어요.</h3>
              </div>
            </div>

            <div className="growth-comparison-list">
              {comparisonItems.map((item) => (
                <article key={item.label} className="growth-comparison-item">
                  <div className="growth-comparison-head">
                    <p>{item.label}</p>
                    <strong>{item.score}점</strong>
                  </div>
                  <div className="growth-comparison-track" aria-hidden="true">
                    <span className="growth-comparison-fill" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="growth-comparison-copy">{item.summary}</p>
                </article>
              ))}
            </div>

            <div className="growth-weekly-card">
              <div className="growth-weekly-head">
                <div>
                  <p className="growth-panel-kicker">주간 학습 그래프</p>
                  <h4>요일별 학습량</h4>
                </div>
                <strong>{weeklyLearnCount}회</strong>
              </div>
              <div className="growth-weekly-bars" aria-label="요일별 학습 횟수">
                {weeklyBars.map((item) => (
                  <div key={item.day} className="growth-weekly-bar-item">
                    <span className="growth-weekly-bar-value">{item.value}</span>
                    <div className="growth-weekly-bar-track">
                      <span
                        className="growth-weekly-bar-fill"
                        style={{ height: `${Math.max(18, (item.value / maxWeeklyValue) * 100)}%` }}
                      />
                    </div>
                    <span className="growth-weekly-bar-label">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </MapingoPageSection>

      <MapingoPageSection title="성장 하이라이트" description="최근 학습에서 눈에 띈 포인트를 그래프와 함께 바로 읽을 수 있게 정리했어요.">
        <div className="growth-highlight-grid">
          {highlightCards.map((card) => (
            <article key={card.title} className={`growth-highlight-card is-${card.tone}`}>
              <div className="growth-highlight-head">
                <div>
                  <p className="growth-highlight-label">핵심 변화</p>
                  <h3>{card.title}</h3>
                </div>
                <span className="growth-highlight-badge">{card.badge}</span>
              </div>

              <p className="growth-highlight-description">{card.description}</p>

              <div className="growth-highlight-chart">
                <TrendSparkline values={card.values} />
              </div>

              <div className="growth-highlight-progress">
                <div className="growth-highlight-progress-head">
                  <span>진행도</span>
                  <strong>{card.progress}%</strong>
                </div>
                <div className="growth-comparison-track" aria-hidden="true">
                  <span className="growth-highlight-progress-fill" style={{ width: `${card.progress}%` }} />
                </div>
              </div>

              <div className="growth-highlight-stats">
                {card.stats.map((stat) => (
                  <div key={stat.label} className="growth-highlight-stat">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </MapingoPageSection>
    </div>
  );
}

export default GrowthProgressPage;
