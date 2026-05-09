import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import PingPopCharacterImage from '../../components/user/PingPopCharacterImage';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import { learningService } from '../../api/user/learningService';
//import { useProfile } from '../../hooks/user/useProfile';
//import { useBadge } from '../../hooks/user/useBadge';

function getBadgeTone(status) {
  if (status === 'earned') return 'success';
  if (status === 'progress') return 'info';
  return 'muted';
}

function getBadgeStatusLabel(status) {
  if (status === 'earned') return '\uD68D\uB4DD \uC644\uB8CC';
  if (status === 'progress') return '\uC9C4\uD589 \uC911';
  return '\uBBF8\uD68D\uB4DD';
}

function getBadgeProgressCopy(badge) {
  if (badge.status === 'earned') {
    return `${badge.condition} \u00b7 \uC644\uB8CC`;
  }

  return `${badge.condition} \u00b7 ${badge.currentValue} / ${badge.targetValue}`;
}

function ProfilePage() {
  const navigate = useNavigate();
  //const { profile } = useProfile();
  //const { badges } = useBadge();
  const profileName = useMapingoStore((state) => state.profileName);
  const subscriptionUpdatedAt = useMapingoStore((state) => state.subscriptionUpdatedAt);
  const currentLevelId = useMapingoStore((state) => state.currentLevelId);
  const recentLearning = useMapingoStore((state) => state.recentLearning);
  const weeklyGoalCompleted = useMapingoStore((state) => state.weeklyGoalCompleted);
  const weeklyLearnCount = useMapingoStore((state) => state.weeklyLearnCount);
  const weeklyGoal = useMapingoStore((state) => state.weeklyGoal);
  const learningStreak = useMapingoStore((state) => state.streakDays);
  const pronunciationScore = useMapingoStore((state) => state.pronunciationScore);
  const storedBadgeProgress = useMapingoStore((state) => state.badgeProgress);
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
  const profileLevelNumber =
    currentLevelId === 'advanced' ? 60 : currentLevelId === 'intermediate' ? 40 : 10;

  const earnedBadges = badgeCatalog.filter((badge) => badge.status === 'earned');
  const badgeCount = earnedBadges.length;
  const topBadge = earnedBadges[0]?.name ?? '\uCCAB \uAC78\uC74C \uBC30\uC9C0';
  const topBadgeDetail = earnedBadges[0]?.condition ?? '\uD559\uC2B5 3\uD68C \uC644\uB8CC';
  const latestLearning = recentLearning[0];
  const badgePreviewList = [...earnedBadges, ...badgeCatalog.filter((badge) => badge.status !== 'earned')].slice(0, 4);
  const completionPercent = Math.min(100, Math.max(12, badgeCount * 12 + weeklyGoalCompleted * 4));
  const cumulativeExperience = profileLevelNumber * 10 + badgeCount * 4;
  const totalStudyCount = badgeProgress.totalStudyCount;
  const nextLevelRemaining = Math.max(0, (profileLevelNumber + 10) * 10 - cumulativeExperience);
  const profileEmail = `${profileName.toLowerCase().replace(/\s+/g, '.')}@mapingo.ai`;
  const weeklyGoalRate = Math.min(100, Math.round((weeklyLearnCount / Math.max(weeklyGoal, 1)) * 100));
  const profileGrowthCards = [
    {
      title: '최근 학습 기록',
      value: latestLearning?.title ?? '첫 학습 대기',
      description: latestLearning
        ? `${latestLearning.meta} 학습을 이어서 진행할 수 있어요.`
        : '아직 완료한 학습이 없어요. 오늘의 첫 학습을 시작해보세요.',
      path: '/growth/insights',
    },
    {
      title: '활용 점수 / 유형별 점수',
      value: `${pronunciationScore}점`,
      description: `이번 주 목표 달성률 ${weeklyGoalRate}% · 누적 학습 ${totalStudyCount}회`,
      path: '/growth/progress',
    },
    {
      title: 'AI 성장 피드백',
      value: learningStreak > 0 ? `${learningStreak}일 연속 학습` : '학습 루틴 준비',
      description:
        learningStreak > 0
          ? '꾸준한 학습 흐름이 좋아요. 발음 리뷰와 상황 회화를 함께 이어가면 성장 속도가 더 안정적이에요.'
          : '짧은 회화 학습부터 시작하면 AI가 성장 패턴을 분석해 맞춤 피드백을 보여줘요.',
      path: '/growth/insights',
    },
  ];

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="My Profile"
        title={'\uD504\uB85C\uD544 \uC815\uBCF4, \uACC4\uC815 \uC0C1\uD0DC, \uD559\uC2B5 \uBAA9\uD45C\uB97C \uD55C \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD574\uBCF4\uC138\uC694'}
        description={'\uD504\uB85C\uD544 \uC815\uBCF4, \uACC4\uC815 \uC0C1\uD0DC, \uD559\uC2B5 \uBAA9\uD45C, \uBC30\uC9C0 \uD604\uD669\uACFC \uCD5C\uADFC \uD559\uC2B5\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.'}
      >
        <section className="mapingo-profile-layout">
          <article
            key={subscriptionUpdatedAt ? `profile-card-${subscriptionUpdatedAt}` : 'profile-card'}
            className={`mapingo-profile-card ${subscriptionUpdatedAt ? 'is-updated' : ''}`}
          >
            <div className="mapingo-profile-card-head">
              <div className="mapingo-profile-identity">
                <div className="mapingo-profile-avatar-column">
                  <div className="mapingo-profile-level-pill">{`Lv.${profileLevelNumber}`}</div>
                  <div className="mapingo-profile-avatar-frame">
                    <div className="mapingo-profile-avatar" aria-hidden="true">
                      <PingPopCharacterImage
                        className="mapingo-profile-avatar-logo"
                        level={profileLevelNumber}
                      />
                    </div>
                  </div>
                </div>
                <div className="mapingo-profile-identity-copy">
                  <h2>{profileName}</h2>
                  <p>{profileEmail}</p>
                  <span className="mapingo-profile-badge-pill">
                    {topBadge} : {topBadgeDetail}
                  </span>
                  <div className="mapingo-profile-progress">
                    <div
                      className="mapingo-profile-progress-fill"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <small>
                    {`\uB2E4\uC74C \uB808\uBCA8 \uBC30\uC9C0\uAE4C\uC9C0 ${Math.max(8, 100 - completionPercent)}% \uB0A8\uC558\uC5B4\uC694`}
                  </small>
                </div>
              </div>

              <button
                type="button"
                className="mapingo-ghost-button"
                onClick={() => navigate('/settings/account')}
              >
                {'\uACC4\uC815 \uAD00\uB9AC'}
              </button>
            </div>

            <div className="mapingo-profile-info-grid">
              <article className="mapingo-profile-info-tile">
                <p className="mapingo-profile-info-label">{'\uD604\uC7AC \uB808\uBCA8'}</p>
                <strong className="mapingo-profile-info-value">{`Lv. ${profileLevelNumber}`}</strong>
                <p className="mapingo-profile-info-hint">
                  {`\uB2E4\uC74C \uB808\uBCA8\uAE4C\uC9C0 ${nextLevelRemaining} EXP \uB0A8\uC558\uC5B4\uC694`}
                </p>
              </article>
              <article className="mapingo-profile-info-tile">
                <p className="mapingo-profile-info-label">{'\uB204\uC801 \uACBD\uD5D8\uCE58'}</p>
                <strong className="mapingo-profile-info-value">{`${cumulativeExperience} EXP`}</strong>
                <p className="mapingo-profile-info-hint">
                  {'\uD559\uC2B5 \uC644\uB8CC\uC640 \uBC1C\uC74C \uB9AC\uBDF0\uB85C \uB204\uC801\uB418\uC5B4\uC694'}
                </p>
              </article>
              <article className="mapingo-profile-info-tile">
                <p className="mapingo-profile-info-label">{'\uCD1D \uD559\uC2B5 \uD69F\uC218'}</p>
                <strong className="mapingo-profile-info-value">{`${totalStudyCount}\uD68C`}</strong>
                <p className="mapingo-profile-info-hint">
                  {'\uC9C0\uAE08\uAE4C\uC9C0 \uC644\uB8CC\uD55C \uD559\uC2B5 \uD69F\uC218\uC608\uC694'}
                </p>
              </article>
              <article className="mapingo-profile-info-tile">
                <p className="mapingo-profile-info-label">{'\uD68D\uB4DD \uBC30\uC9C0'}</p>
                <strong className="mapingo-profile-info-value">{`${badgeCount}\uAC1C`}</strong>
                <p className="mapingo-profile-info-hint">
                  {'\uC9C0\uAE08\uAE4C\uC9C0 \uBAA8\uC740 \uBC30\uC9C0 \uAC1C\uC218\uC608\uC694'}
                </p>
              </article>
            </div>
          </article>

          <div className="mapingo-profile-side-column">
            <article className="mapingo-profile-side-card">
              <h3>{'\uCD5C\uADFC \uD559\uC2B5'}</h3>
              <p>
                {latestLearning
                  ? `${latestLearning.title} · ${'\uB9C8\uC9C0\uB9C9 \uD559\uC2B5'} ${latestLearning.meta} · ${'\uC774\uC5B4\uC11C \uD559\uC2B5 \uAC00\uB2A5'}`
                  : '\uC544\uC9C1 \uCD5C\uADFC \uD559\uC2B5 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694. \uCCAB \uD559\uC2B5\uC744 \uC2DC\uC791\uD574\uBCF4\uC138\uC694.'}
              </p>
            </article>

            <article className="mapingo-profile-side-card mapingo-profile-badge-status-card">
              <div className="mapingo-profile-side-head">
                <h3>{'\uBC30\uC9C0 \uD604\uD669'}</h3>
              </div>

              <div className="mapingo-profile-badge-status-list">
                {badgePreviewList.map((badge) => (
                  <div key={badge.id} className="mapingo-profile-badge-status-item">
                    <div className="mapingo-profile-badge-status-media">
                      <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="mapingo-profile-badge-status-image"
                      />
                    </div>
                    <div className="mapingo-profile-badge-status-copy">
                      <strong>{badge.name}</strong>
                      <p>{getBadgeProgressCopy(badge)}</p>
                    </div>
                    <span
                      className={`mapingo-profile-badge-status-pill is-${getBadgeTone(
                        badge.status,
                      )}`}
                    >
                      {getBadgeStatusLabel(badge.status)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="mapingo-profile-growth-section" aria-labelledby="profile-growth-title">
          <div className="mapingo-profile-growth-head">
            <div>
              <p className="mapingo-profile-info-label">Growth Analysis</p>
              <h2 id="profile-growth-title">학습 기록 & 성장 분석</h2>
            </div>
            <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/growth')}>
              {'성장 리포트'}
            </button>
          </div>

          <div className="mapingo-profile-growth-grid">
            {profileGrowthCards.map((card) => (
              <button
                key={card.title}
                type="button"
                className="mapingo-profile-growth-card"
                onClick={() => navigate(card.path)}
              >
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <p>{card.description}</p>
              </button>
            ))}
          </div>
        </section>
      </MapingoPageSection>
    </div>
  );
}

export default ProfilePage;
