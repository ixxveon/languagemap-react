import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import FriendProfileCard from '../../components/social/FriendProfileCard';
import RecommendFriendCard from '../../components/social/RecommendFriendCard';
import ReportCard from '../../components/social/ReportCard';
import { useCommunityFriends } from '../../hooks/community/useCommunityFriend';
import '../../styles/user/CommunityFriendsPage.css';

function CommunityFriendsPage() {
  const navigate = useNavigate();

  const {
    currentUserId,
    userDirectory,
    acceptedFriends,
    pendingRequests,
    archivedRelations,
    availableUsers,
    recommendedFriends,
    userReportRows,
    inviteQuery,
    reportTargetId,
    reportReason,
    feedbackMessage,
    setInviteQuery,
    setReportTargetId,
    setReportReason,
    sendFriendRequest,
    handleInvite,
    handleAccept,
    handleReject,
    handleDelete,
    handleBlock,
    handleSubmitReport,
    clearFeedbackMessage,
  } = useCommunityFriends();

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
                <span className="mapingo-muted-copy">
                  현재 연결된 친구 {acceptedFriends.length}명
                </span>
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
                      userDirectory={userDirectory}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onDelete={handleDelete}
                      onBlock={handleBlock}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="community-friends-dual-grid">
              <div className="mapingo-list-card">
                <div className="mapingo-card-header-row">
                  <h3>대기 중인 요청</h3>
                  <span className="mapingo-muted-copy">
                    받은 요청은 수락/거절, 보낸 요청은 취소할 수 있어요
                  </span>
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
                        userDirectory={userDirectory}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onDelete={handleDelete}
                        onBlock={handleBlock}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mapingo-list-card">
                <div className="mapingo-card-header-row">
                  <h3>차단 및 거절 이력</h3>
                  <span className="mapingo-muted-copy">
                    최근 관계 변경 내역
                  </span>
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
                        userDirectory={userDirectory}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onDelete={handleDelete}
                        onBlock={handleBlock}
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
                <span className="mapingo-muted-copy">
                  접수된 신고 {userReportRows.length}건
                </span>
              </div>

              {userReportRows.length === 0 ? (
                <div className="community-friends-empty-card">
                  신고 이력이 없어요.
                </div>
              ) : (
                <div className="community-friends-report-list">
                  {userReportRows.map((report) => (
                    <ReportCard
                      key={report.report_id}
                      report={report}
                      userDirectory={userDirectory}
                    />
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
                    <RecommendFriendCard
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
              <p>
                닉네임이나 이메일로 사용자를 찾아 직접 친구 요청을 보낼 수
                있어요.
              </p>

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
            </div>
          </aside>
        </div>
      </section>

      {feedbackMessage ? (
        <div className="community-friends-popup-backdrop">
          <div className="community-friends-popup">
            <h3>알림</h3>
            <p>{feedbackMessage}</p>

            <button
              type="button"
              className="mapingo-submit-button"
              onClick={clearFeedbackMessage}
            >
              확인
            </button>
          </div>
        </div>
      ) : null}F
    </div>
  );
}

export default CommunityFriendsPage;
