import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import PingPopCharacterImage from '../../components/PingPopCharacterImage';
import '../../styles/CommunityFriendsPage.css';

const TODAY = '2026-04-21';

const userDirectory = {
  1: {
    userId: 1,
    name: 'Mapingo Learner',
    email: 'learner@mapingo.ai',
    levelLabel: 'Lv.40',
    levelNumber: 40,
    accountStatus: '정상 이용 중 · 일반 회원',
    levelTitle: 'Intermediate',
    goalText: '주 5회 말하기 연습',
    badgeText: '꾸준한 학습 배지',
  },
  2: {
    userId: 2,
    name: 'Mina',
    email: 'mina@mapingo.ai',
    levelLabel: 'Lv.20',
    levelNumber: 20,
    accountStatus: '정상 이용 중 · 일반 회원',
    levelTitle: 'Beginner',
    goalText: '주 3회 발음 리뷰',
    badgeText: '첫 학습 배지',
  },
  3: {
    userId: 3,
    name: 'Joon',
    email: 'joon@mapingo.ai',
    levelLabel: 'Lv.30',
    levelNumber: 30,
    accountStatus: '정상 이용 중 · 일반 회원',
    levelTitle: 'Intermediate',
    goalText: '주 4회 상황 회화',
    badgeText: '주간 목표 달성 배지',
  },
  4: {
    userId: 4,
    name: 'Sora',
    email: 'sora@mapingo.ai',
    levelLabel: 'Lv.10',
    levelNumber: 10,
    accountStatus: '정상 이용 중 · 일반 회원',
    levelTitle: 'Starter',
    goalText: '주 2회 시작 루틴 유지',
    badgeText: '첫 학습 배지',
  },
  5: {
    userId: 5,
    name: 'Alex',
    email: 'alex@mapingo.ai',
    levelLabel: 'Lv.50',
    levelNumber: 50,
    accountStatus: '제한된 상태 · 검토 중',
    levelTitle: 'Advanced',
    goalText: '주 6회 자유 말하기',
    badgeText: '발음 집중 배지',
  },
  6: {
    userId: 6,
    name: 'Yuna',
    email: 'yuna@mapingo.ai',
    levelLabel: 'Lv.24',
    levelNumber: 24,
    accountStatus: '정상 이용 중 · 일반 회원',
    levelTitle: 'Beginner',
    goalText: '여행 표현 매일 10분',
    badgeText: '여행 회화 배지',
  },
  7: {
    userId: 7,
    name: 'Kevin',
    email: 'kevin@mapingo.ai',
    levelLabel: 'Lv.37',
    levelNumber: 37,
    accountStatus: '정상 이용 중 · 일반 회원',
    levelTitle: 'Intermediate',
    goalText: '출근 전 회화 루틴',
    badgeText: '아침 루틴 배지',
  },
};

const recommendedFriendSeeds = [
  {
    userId: 6,
    matchLabel: '92% 잘 맞아요',
    reason: '여행 표현 루틴이 비슷해요.',
  },
  {
    userId: 7,
    matchLabel: '88% 잘 맞아요',
    reason: '아침 회화 연습 시간대가 겹쳐요.',
  },
  {
    userId: 2,
    matchLabel: '84% 잘 맞아요',
    reason: '발음 리뷰와 회화 연습 패턴이 비슷해요.',
  },
];

const initialFriendshipRows = [
  {
    friendship_id: 1,
    requester_id: 1,
    addressee_id: 2,
    status: 'ACCEPTED',
    requested_at: '2026-04-11 09:20:00',
    responded_at: '2026-04-11 10:00:00',
  },
  {
    friendship_id: 2,
    requester_id: 3,
    addressee_id: 1,
    status: 'PENDING',
    requested_at: '2026-04-20 13:10:00',
    responded_at: null,
  },
  {
    friendship_id: 3,
    requester_id: 1,
    addressee_id: 4,
    status: 'PENDING',
    requested_at: '2026-04-20 20:30:00',
    responded_at: null,
  },
  {
    friendship_id: 4,
    requester_id: 1,
    addressee_id: 5,
    status: 'BLOCKED',
    requested_at: '2026-04-05 17:00:00',
    responded_at: '2026-04-06 09:00:00',
  },
];

const initialUserReportRows = [
  {
    report_id: 1,
    reporter_id: 1,
    reported_user_id: 5,
    reason: '반복적으로 원치 않는 친구 요청을 보내고 있어요.',
    status: 'PENDING',
    created_at: '2026-04-20 21:00:00',
    processed_at: null,
    admin_memo: null,
  },
  {
    report_id: 2,
    reporter_id: 1,
    reported_user_id: 4,
    reason: '채팅에서 부적절한 표현을 사용했어요.',
    status: 'RESOLVED',
    created_at: '2026-04-12 15:40:00',
    processed_at: '2026-04-13 10:00:00',
    admin_memo: '경고 조치 후 기능 사용 제한을 안내했습니다.',
  },
];

function formatDate(dateString) {
  if (!dateString) return '-';
  const [date] = dateString.split(' ');
  return date.replaceAll('-', '.');
}

function getStatusLabel(status) {
  if (status === 'ACCEPTED') return '친구';
  if (status === 'PENDING') return '대기 중';
  if (status === 'REJECTED') return '거절됨';
  if (status === 'BLOCKED') return '차단됨';
  if (status === 'RESOLVED') return '처리 완료';
  return '접수됨';
}

function getStatusTone(status) {
  if (status === 'ACCEPTED' || status === 'RESOLVED') return 'success';
  if (status === 'PENDING') return 'info';
  if (status === 'BLOCKED' || status === 'REJECTED') return 'danger';
  return 'muted';
}

function getLevelTone(levelNumber) {
  if (levelNumber >= 40) return 'violet';
  if (levelNumber >= 30) return 'sky';
  if (levelNumber >= 20) return 'mint';
  return 'lime';
}

function StatusPill({ status }) {
  return (
    <span className={`community-friends-status-pill is-${getStatusTone(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

function FriendProfileCard({
  relation,
  currentUserId,
  onAccept,
  onReject,
  onDelete,
  onBlock,
  onUnblock,
  compact = false,
}) {
  const otherUserId =
    relation.requester_id === currentUserId
      ? relation.addressee_id
      : relation.requester_id;
  const user = userDirectory[otherUserId];
  const isAccepted = relation.status === 'ACCEPTED';
  const levelTone = getLevelTone(user.levelNumber);

  if (compact) {
    return (
      <article className="community-friends-profile-card is-compact">
        <div className="community-friends-compact-main">
          <div className="community-friends-avatar-column">
            <div className={`community-friends-level-pill is-${levelTone}`}>
              {user.levelLabel}
            </div>
            <div className="community-friends-avatar-frame is-compact">
              <div className="mapingo-profile-avatar mapingo-friend-avatar" aria-hidden="true">
                <PingPopCharacterImage
                  className="mapingo-profile-avatar-logo"
                  level={user.levelNumber}
                />
              </div>
            </div>
          </div>

          <div className="community-friends-compact-copy">
            <div className="community-friends-title-row">
              <h4>{user.name}</h4>
              <StatusPill status={relation.status} />
            </div>
            <p>{user.email}</p>
            <span className={`community-friends-badge-pill is-${levelTone}`}>
              {user.badgeText}
            </span>
            <small>{user.goalText}</small>
          </div>
        </div>

        {relation.status === 'PENDING' ? (
          <div className="community-friends-compact-actions">
            <button
              type="button"
              className="mapingo-submit-button"
              onClick={() => onAccept(relation.friendship_id)}
            >
              수락
            </button>
            <button
              type="button"
              className="mapingo-ghost-button"
              onClick={() => onReject(relation.friendship_id)}
            >
              거절
            </button>
          </div>
        ) : null}

        {isAccepted ? (
          <div className="community-friends-compact-actions">
            <button
              type="button"
              className="mapingo-ghost-button community-friends-block-button"
              onClick={() => onBlock(relation.friendship_id)}
            >
              친구 차단
            </button>
            <button
              type="button"
              className="mapingo-ghost-button"
              onClick={() => onDelete(relation.friendship_id)}
            >
              친구 삭제
            </button>
          </div>
        ) : null}

        {relation.status === 'BLOCKED' ? (
          <div className="community-friends-compact-actions">
            <button
              type="button"
              className="mapingo-submit-button"
              onClick={() => onUnblock(relation.friendship_id)}
            >
              차단 취소
            </button>
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <article className="community-friends-profile-card is-featured">
      <div className="community-friends-profile-head">
        <div className="community-friends-identity">
          <div className="community-friends-avatar-column">
            <div className={`community-friends-level-pill is-${levelTone}`}>
              {user.levelLabel}
            </div>
            <div className="community-friends-avatar-frame">
              <div className="mapingo-profile-avatar mapingo-friend-avatar" aria-hidden="true">
                <PingPopCharacterImage
                  className="mapingo-profile-avatar-logo"
                  level={user.levelNumber}
                />
              </div>
            </div>
          </div>

          <div className="community-friends-copy">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`community-friends-badge-pill is-${levelTone}`}>
              {user.badgeText}
            </span>
            <small>다음 학습 배지까지 꾸준히 이어가고 있어요.</small>
          </div>
        </div>

        <div className="community-friends-actions">
          <StatusPill status={relation.status} />
          {isAccepted ? (
            <button
              type="button"
              className="mapingo-ghost-button community-friends-block-button"
              onClick={() => onBlock(relation.friendship_id)}
            >
              친구 차단
            </button>
          ) : null}
          {isAccepted ? (
            <button
              type="button"
              className="mapingo-ghost-button"
              onClick={() => onDelete(relation.friendship_id)}
            >
              친구 삭제
            </button>
          ) : null}
        </div>
      </div>

      <div className="community-friends-info-grid">
        <article className="community-friends-info-tile">
          <strong>계정 상태</strong>
          <p>{user.accountStatus}</p>
        </article>
        <article className="community-friends-info-tile">
          <strong>학습 레벨</strong>
          <p>
            {user.levelTitle} · {user.levelLabel}
          </p>
        </article>
        <article className="community-friends-info-tile">
          <strong>학습 목표</strong>
          <p>{user.goalText}</p>
        </article>
        <article className="community-friends-info-tile">
          <strong>연결 정보</strong>
          <p>{`요청일 ${formatDate(relation.requested_at)}`}</p>
        </article>
      </div>
    </article>
  );
}

function RecommendedFriendCard({ user, recommendation, onAdd }) {
  const levelTone = getLevelTone(user.levelNumber);

  return (
    <article className="community-friends-recommend-card">
      <div className="community-friends-recommend-head">
        <div className="community-friends-recommend-profile">
          <div className="community-friends-avatar-frame is-small">
            <div className="mapingo-profile-avatar mapingo-friend-avatar" aria-hidden="true">
              <PingPopCharacterImage
                className="mapingo-profile-avatar-logo"
                level={user.levelNumber}
              />
            </div>
          </div>

          <div className="community-friends-copy is-recommend">
            <div className="community-friends-title-row">
              <h4>{user.name}</h4>
              <span className="community-friends-match-pill">{recommendation.matchLabel}</span>
            </div>
            <p>{user.goalText}</p>
            <span className={`community-friends-badge-pill is-${levelTone}`}>
              {user.badgeText}
            </span>
            <small>{recommendation.reason}</small>
          </div>
        </div>

        <button
          type="button"
          className="mapingo-submit-button"
          onClick={() => onAdd(user.userId)}
        >
          친구 추가
        </button>
      </div>
    </article>
  );
}

function ReportCard({ report }) {
  const reportedUser = userDirectory[report.reported_user_id];

  return (
    <article className="community-friends-report-card">
      <div className="community-friends-title-row">
        <h4>{reportedUser.name}</h4>
        <StatusPill status={report.status} />
      </div>
      <p className="community-friends-report-reason">{report.reason}</p>
      <div className="community-friends-meta-row">
        <span>신고일 {formatDate(report.created_at)}</span>
        <span>
          {report.processed_at ? `처리일 ${formatDate(report.processed_at)}` : '처리 대기 중'}
        </span>
      </div>
      {report.admin_memo ? (
        <div className="community-friends-admin-memo">
          <strong>관리자 메모</strong>
          <p>{report.admin_memo}</p>
        </div>
      ) : null}
    </article>
  );
}

function CommunityFriendsPage() {
  const navigate = useNavigate();
  const currentUserId = 1;
  const [friendshipRows, setFriendshipRows] = useState(initialFriendshipRows);
  const [userReportRows, setUserReportRows] = useState(initialUserReportRows);
  const [inviteQuery, setInviteQuery] = useState('');
  const [reportTargetId, setReportTargetId] = useState('2');
  const [reportReason, setReportReason] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const acceptedFriends = useMemo(
    () =>
      friendshipRows.filter(
        (row) =>
          row.status === 'ACCEPTED' &&
          (row.requester_id === currentUserId || row.addressee_id === currentUserId),
      ),
    [friendshipRows],
  );

  const pendingRequests = useMemo(
    () =>
      friendshipRows.filter(
        (row) =>
          row.status === 'PENDING' &&
          (row.requester_id === currentUserId || row.addressee_id === currentUserId),
      ),
    [friendshipRows],
  );

  const archivedRelations = useMemo(
    () =>
      friendshipRows.filter(
        (row) =>
          ['REJECTED', 'BLOCKED'].includes(row.status) &&
          (row.requester_id === currentUserId || row.addressee_id === currentUserId),
      ),
    [friendshipRows],
  );

  const availableUsers = Object.values(userDirectory).filter(
    (user) => user.userId !== currentUserId,
  );

  const hasExistingRelation = (targetUserId) =>
    friendshipRows.some(
      (row) =>
        (row.requester_id === currentUserId && row.addressee_id === targetUserId) ||
        (row.requester_id === targetUserId && row.addressee_id === currentUserId),
    );

  const recommendedFriends = recommendedFriendSeeds.filter(
    (item) => !hasExistingRelation(item.userId) && userDirectory[item.userId],
  );

  const sendFriendRequest = (targetUserId) => {
    const targetUser = userDirectory[targetUserId];

    if (!targetUser) {
      setFeedbackMessage('요청할 사용자를 찾지 못했어요.');
      return;
    }

    if (hasExistingRelation(targetUserId)) {
      setFeedbackMessage('이미 친구 요청을 보냈거나 연결된 사용자예요.');
      return;
    }

    setFriendshipRows((current) => [
      {
        friendship_id: current.length + 1,
        requester_id: currentUserId,
        addressee_id: targetUserId,
        status: 'PENDING',
        requested_at: `${TODAY} 09:00:00`,
        responded_at: null,
      },
      ...current,
    ]);
    setFeedbackMessage(`${targetUser.name}님에게 친구 요청을 보냈어요.`);
  };

  const handleInvite = () => {
    const normalizedQuery = inviteQuery.trim().toLowerCase();
    const targetUser = availableUsers.find(
      (user) =>
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery),
    );

    if (!normalizedQuery) {
      setFeedbackMessage('닉네임이나 이메일을 입력해 주세요.');
      return;
    }

    if (!targetUser) {
      setFeedbackMessage('일치하는 사용자를 찾지 못했어요.');
      return;
    }

    sendFriendRequest(targetUser.userId);
    setInviteQuery('');
  };

  const handleAccept = (friendshipId) => {
    setFriendshipRows((current) =>
      current.map((row) =>
        row.friendship_id === friendshipId
          ? {
              ...row,
              status: 'ACCEPTED',
              responded_at: `${TODAY} 11:00:00`,
            }
          : row,
      ),
    );
    setFeedbackMessage('친구 요청을 수락했어요.');
  };

  const handleReject = (friendshipId) => {
    setFriendshipRows((current) =>
      current.map((row) =>
        row.friendship_id === friendshipId
          ? {
              ...row,
              status: 'REJECTED',
              responded_at: `${TODAY} 11:00:00`,
            }
          : row,
      ),
    );
    setFeedbackMessage('친구 요청을 거절했어요.');
  };

  const handleDelete = (friendshipId) => {
    setFriendshipRows((current) =>
      current.filter((row) => row.friendship_id !== friendshipId),
    );
    setFeedbackMessage('친구 목록에서 삭제했어요.');
  };

  const handleBlock = (friendshipId) => {
    setFriendshipRows((current) =>
      current.map((row) =>
        row.friendship_id === friendshipId
          ? {
              ...row,
              status: 'BLOCKED',
              responded_at: `${TODAY} 11:00:00`,
            }
          : row,
      ),
    );
    setFeedbackMessage('친구를 차단했어요. 차단 이력에서 확인할 수 있어요.');
  };

  const handleUnblock = (friendshipId) => {
    setFriendshipRows((current) =>
      current.map((row) =>
        row.friendship_id === friendshipId
          ? {
              ...row,
              status: 'ACCEPTED',
              responded_at: `${TODAY} 11:30:00`,
            }
          : row,
      ),
    );
    setFeedbackMessage('차단을 취소했어요. 다시 친구 목록에서 확인할 수 있어요.');
  };

  const handleSubmitReport = () => {
    if (!reportReason.trim()) {
      setFeedbackMessage('신고 사유를 입력해 주세요.');
      return;
    }

    setUserReportRows((current) => [
      {
        report_id: current.length + 1,
        reporter_id: currentUserId,
        reported_user_id: Number(reportTargetId),
        reason: reportReason.trim(),
        status: 'PENDING',
        created_at: `${TODAY} 14:00:00`,
        processed_at: null,
        admin_memo: null,
      },
      ...current,
    ]);
    setReportReason('');
    setFeedbackMessage('신고가 접수되었어요.');
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="친구 관리"
        title="친구 요청, 목록, 신고까지 한 번에 관리해보세요"
        description="친구 연결 상태를 빠르게 확인하고, 검색이나 추천 친구를 통해 새 연결도 바로 만들 수 있어요."
      >
        <div className="mapingo-page-actions">
          <button
            type="button"
            className="mapingo-ghost-button"
            onClick={() => navigate('/community')}
          >
            커뮤니티 메인으로
          </button>
        </div>
      </MapingoPageSection>

      <section className="mapingo-page-section">
        <div className="community-friends-layout">
          <div className="community-friends-main">
            <div className="mapingo-list-card">
              <div className="mapingo-card-header-row">
                <h3>친구 목록</h3>
                <span className="mapingo-muted-copy">현재 연결된 친구 {acceptedFriends.length}명</span>
              </div>

              {acceptedFriends.length === 0 ? (
                <div className="community-friends-empty-card">
                  아직 친구로 연결된 사용자가 없어요.
                </div>
              ) : (
                <div className="community-friends-card-list">
                  {acceptedFriends.map((friendship) => (
                    <FriendProfileCard
                      key={friendship.friendship_id}
                      relation={friendship}
                      currentUserId={currentUserId}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onDelete={handleDelete}
                      onBlock={handleBlock}
                      onUnblock={handleUnblock}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="community-friends-dual-grid">
              <div className="mapingo-list-card">
                <div className="mapingo-card-header-row">
                  <h3>대기 중인 요청</h3>
                  <span className="mapingo-muted-copy">수락 또는 거절할 수 있어요</span>
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="community-friends-empty-card">
                    처리할 친구 요청이 없어요.
                  </div>
                ) : (
                  <div className="community-friends-card-list">
                    {pendingRequests.map((friendship) => (
                      <FriendProfileCard
                        key={friendship.friendship_id}
                        relation={friendship}
                        currentUserId={currentUserId}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onDelete={handleDelete}
                        onBlock={handleBlock}
                        onUnblock={handleUnblock}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mapingo-list-card">
                <div className="mapingo-card-header-row">
                  <h3>차단 및 거절 이력</h3>
                  <span className="mapingo-muted-copy">최근 관계 변경 내역</span>
                </div>

                {archivedRelations.length === 0 ? (
                  <div className="community-friends-empty-card">
                    보관 중인 이력이 없어요.
                  </div>
                ) : (
                  <div className="community-friends-card-list">
                    {archivedRelations.map((friendship) => (
                      <FriendProfileCard
                        key={friendship.friendship_id}
                        relation={friendship}
                        currentUserId={currentUserId}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onDelete={handleDelete}
                        onBlock={handleBlock}
                        onUnblock={handleUnblock}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mapingo-list-card">
              <div className="mapingo-card-header-row">
                <h3>신고 이력</h3>
                <span className="mapingo-muted-copy">접수된 신고 {userReportRows.length}건</span>
              </div>

              {userReportRows.length === 0 ? (
                <div className="community-friends-empty-card">
                  신고 이력이 없어요.
                </div>
              ) : (
                <div className="community-friends-report-list">
                  {userReportRows.map((report) => (
                    <ReportCard key={report.report_id} report={report} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="community-friends-side">
            <div className="mapingo-form-card community-friends-panel">
              <h3>추천 친구</h3>
              <p>학습 패턴이 비슷한 사용자를 바로 친구로 추가해보세요.</p>

              <div className="community-friends-recommend-list">
                {recommendedFriends.length === 0 ? (
                  <div className="community-friends-empty-card">
                    지금 보여줄 추천 친구가 없어요.
                  </div>
                ) : (
                  recommendedFriends.map((item) => (
                    <RecommendedFriendCard
                      key={item.userId}
                      recommendation={item}
                      user={userDirectory[item.userId]}
                      onAdd={sendFriendRequest}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mapingo-form-card community-friends-panel">
              <h3>검색으로 친구 추가</h3>
              <p>닉네임이나 이메일로 사용자를 찾아 직접 친구 요청을 보낼 수 있어요.</p>
              <input
                className="mapingo-input"
                value={inviteQuery}
                onChange={(event) => setInviteQuery(event.target.value)}
                placeholder="예: mina 또는 mina@mapingo.ai"
              />
              <button
                type="button"
                className="mapingo-submit-button"
                onClick={handleInvite}
              >
                친구 요청 보내기
              </button>
            </div>

            <div className="mapingo-form-card community-friends-panel">
              <h3>사용자 신고</h3>
              <p>문제가 있는 사용자를 선택하고 신고 사유를 남겨주세요.</p>

              <select
                className="mapingo-select"
                value={reportTargetId}
                onChange={(event) => setReportTargetId(event.target.value)}
              >
                {availableUsers.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.name}
                  </option>
                ))}
              </select>

              <textarea
                className="mapingo-textarea"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                placeholder="신고 사유를 구체적으로 입력해 주세요."
              />

              <button
                type="button"
                className="mapingo-submit-button"
                onClick={handleSubmitReport}
              >
                신고 접수
              </button>

              <p className="community-friends-feedback">{feedbackMessage}</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default CommunityFriendsPage;
