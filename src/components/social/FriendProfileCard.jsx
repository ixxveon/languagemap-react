import PingPopCharacterImage from '../user/PingPopCharacterImage';
import {
    formatDate,
    getLevelTone,
} from '../../utils/community/friendUtils';
import StatusPill from './StatusPill';

function FriendProfileCard({
    relation,
    currentUserId,
    onAccept,
    onReject,
    onDelete,
    onBlock,
    compact = false,
}) {
    const otherUserId =
        relation.requester_id === currentUserId
            ? relation.addressee_id
            : relation.requester_id;

    const user = {
        userId: otherUserId,
        name:
            relation.requester_id === currentUserId
                ? relation.addressee_name || '사용자'
                : relation.requester_name || '사용자',
        email:
            relation.requester_id === currentUserId
                ? relation.addressee_email || '-'
                : relation.requester_email || '-',
        levelLabel: 'Lv.1',
        levelNumber: 1,
        accountStatus: '정상 이용 중',
        levelTitle: 'Starter',
        goalText: '학습 목표 정보가 없어요.',
        badgeText: '기본 배지',
    };

    const isAccepted = relation.status === 'ACCEPTED';
    const isReceivedRequest =
        relation.status === 'PENDING' && relation.addressee_id === currentUserId;

    const isSentRequest =
        relation.status === 'PENDING' && relation.requester_id === currentUserId;

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
                            <div
                                className="mapingo-profile-avatar mapingo-friend-avatar"
                                aria-hidden="true"
                            >
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

                {isReceivedRequest ? (
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

                {isSentRequest ? (
                    <div className="community-friends-compact-actions">
                        <button
                            type="button"
                            className="mapingo-ghost-button"
                            onClick={() => onDelete(relation.friendship_id)}
                        >
                            요청 취소
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
                            <div
                                className="mapingo-profile-avatar mapingo-friend-avatar"
                                aria-hidden="true"
                            >
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
                        <>
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
                        </>
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

export default FriendProfileCard;
