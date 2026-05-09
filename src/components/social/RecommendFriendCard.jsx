import PingPopCharacterImage from '../user/PingPopCharacterImage';
import { getLevelTone } from '../../utils/community/friendUtils';

function RecommendFriendCard({ user, recommendation, onAdd }) {
    const levelNumber = user?.levelNumber ?? 1;
    const levelTone = getLevelTone(levelNumber);

    const matchLabel = recommendation?.matchLabel ?? user?.matchLabel ?? '추천 친구';
    const reason = recommendation?.reason ?? user?.reason ?? '학습 패턴이 비슷해요.';

    return (
        <article className="community-friends-recommend-card">
            <div className="community-friends-recommend-head">
                <div className="community-friends-recommend-profile">
                    <div className="community-friends-avatar-frame is-small">
                        <div
                            className="mapingo-profile-avatar mapingo-friend-avatar"
                            aria-hidden="true"
                        >
                            <PingPopCharacterImage
                                className="mapingo-profile-avatar-logo"
                                level={levelNumber}
                            />
                        </div>
                    </div>

                    <div className="community-friends-copy is-recommend">
                        <div className="community-friends-title-row">
                            <h4>{user?.name ?? '이름 없음'}</h4>
                            <span className="community-friends-match-pill">
                                {matchLabel}
                            </span>
                        </div>

                        <p>{user?.goalText ?? '학습 목표 정보가 없어요.'}</p>

                        <span className={`community-friends-badge-pill is-${levelTone}`}>
                            {user?.badgeText ?? '기본 배지'}
                        </span>

                        <small>{reason}</small>
                    </div>
                </div>

                <button
                    type="button"
                    className="mapingo-submit-button"
                    onClick={() => onAdd(user?.userId)}
                    disabled={!user?.userId}
                >
                    친구 추가
                </button>
            </div>
        </article>
    );
}

export default RecommendFriendCard;