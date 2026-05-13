import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import PingPopCharacterImage from '../../components/user/PingPopCharacterImage';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import { placeService } from '../../api/place/placeService';
import { userService } from '../../api/user/userService';
import { paymentService } from '../../api/user/paymentService';
import { useQuery } from '@tanstack/react-query';

function formatRoleLabel(role) {
  return role === 'admin' ? '관리자' : '일반 사용자';
}

function formatBirthDate(value) {
  if (!value) {
    return '미등록';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toISOString().slice(0, 10);
}

function formatPhoneNumber(value) {
  if (!value) {
    return '미등록';
  }

  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return String(value);
}

function normalizePhoneNumber(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);

  if (digits.length < 4) {
    return digits;
  }

  if (digits.length < 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatRecentTime(endTime) {
  if (!endTime) return '';

  const date = new Date(endTime);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  const period = date.getHours() < 12 ? '오전' : '오후';
  const hour = date.getHours() % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');

  if (isToday) {
    return `오늘 ${period} ${hour}:${minute}`;
  }

  if (isYesterday) {
    return `어제 ${period} ${hour}:${minute}`;
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${period} ${hour}:${minute}`;
}

function buildProfileForm(profileName, profileEmail, user) {
  return {
    name: profileName || '',
    email: profileEmail || '',
    birthDate: formatBirthDate(user.birthDate) === '미등록' ? '' : formatBirthDate(user.birthDate),
    phoneNumber:
      formatPhoneNumber(user.phoneNumber ?? user.phone) === '미등록'
        ? ''
        : formatPhoneNumber(user.phoneNumber ?? user.phone),
    address: user.address ?? '',
    role: formatRoleLabel(user.role),
  };
}

function ProfilePage() {
  const navigate = useNavigate();
  const session = useMapingoStore((state) => state.session);
  const setSession = useMapingoStore((state) => state.setSession);
  const profileName = useMapingoStore((state) => state.profileName);
  const currentLevelId = useMapingoStore((state) => state.currentLevelId);
  const recentLearning = useMapingoStore((state) => state.recentLearning);
  const weeklyLearnCount = useMapingoStore((state) => state.weeklyLearnCount);
  const weeklyGoal = Number(useMapingoStore((state) => state.weeklyGoal) || 0);
  const streakDays = useMapingoStore((state) => state.streakDays);
  const pronunciationScore = useMapingoStore((state) => state.pronunciationScore);
  const badgeCount = useMapingoStore((state) => state.badgeCount);
  const updateProfileDetails = useMapingoStore((state) => state.updateProfileDetails);
  const clearSession = useMapingoStore((state) => state.clearSession);
  const [recentLearningPlaces, setRecentLearningPlaces] = useState([]);

  const user = session?.user ?? {};
  const profileLevelNumber =
    currentLevelId === 'advanced' ? 60 : currentLevelId === 'intermediate' ? 40 : 10;
  const profileEmail =
    user.email ?? `${String(profileName).toLowerCase().replace(/\s+/g, '.')}@mapingo.ai`;
  const levelProgressPercent = Math.min(100, Math.max(12, weeklyLearnCount * 7 + badgeCount * 3));
  const cumulativeExperience = profileLevelNumber * 300 + weeklyLearnCount * 120 + badgeCount * 50;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => buildProfileForm(profileName, profileEmail, user));

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const dbUser = await userService.getMe();

        // 구독 정보도 같이 조회
        let subscriptionPlan = 'Free';
        try {
          const subscription = await paymentService.getSubscription();
          if (subscription?.planStatus === 'ACTIVE') {
            subscriptionPlan = 'Premium';
            // planType으로 productId 설정
            const productId = subscription.planType === 'MONTHLY' ? 'monthly' : 'yearly';
            useMapingoStore.getState().setSubscriptionProductId(productId);
          }
        } catch {
          // 구독 없으면 Free 유지
        }

        setSession({
          ...session,
          user: {
            ...session.user,
            name: dbUser.name,
            email: dbUser.email,
            birthDate: dbUser.birthDate,
            address: dbUser.address,
            phoneNumber: dbUser.phoneNumber,
            role: dbUser.role?.toLowerCase(),
            status: dbUser.status,
          },
        });
        useMapingoStore.getState().setSubscriptionPlan(subscriptionPlan);

      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
      }
    };

    fetchMe();
  }, []);

  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        return await paymentService.getSubscription();
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const activePlanType = subscriptionData?.planType;
  const planStartAt = subscriptionData?.planStartAt;
  const planEndAt = subscriptionData?.planEndAt;

  useEffect(() => {
    if (!isEditing) {
      setForm(buildProfileForm(profileName, profileEmail, user));
    }
  }, [isEditing, profileEmail, profileName, user]);

  useEffect(() => {
    const loadRecentLearningPlaces = async () => {
      try {
        const data = await placeService.readRecentLearningPlaces();

        console.log('최근 학습 장소:', data);

        setRecentLearningPlaces(data);
      } catch (error) {
        console.error('최근 학습 장소 조회 실패:', error);
      }
    };

    loadRecentLearningPlaces();
  }, []);

  const profileInfoItems = [
    { key: 'name', label: '이름', value: profileName || '미등록', type: 'text', editable: true },
    { key: 'email', label: '이메일', value: profileEmail || '미등록', type: 'email', editable: false },
    {
      key: 'birthDate',
      label: '생년월일',
      value: formatBirthDate(user.birthDate),
      type: 'date',
      editable: false,
    },
    {
      key: 'phoneNumber',
      label: '전화번호',
      value: formatPhoneNumber(user.phoneNumber ?? user.phone),
      type: 'tel',
      editable: true,
    },
    { key: 'address', label: '주소', value: user.address || '미등록', type: 'text', editable: true },
    { key: 'role', label: '권한', value: formatRoleLabel(user.role), type: 'text', editable: false },
    {
      key: 'subscriptionPlan',
      label: '현재 구독 플랜',
      value: activePlanType
        ? `${activePlanType === 'MONTHLY' ? '1개월 플랜' : '1년 플랜'} (${planStartAt?.slice(0, 10)} ~ ${planEndAt?.slice(0, 10)})`
        : 'Free',
      type: 'text',
      editable: false,
    },
  ];

  const currentGoalItems = useMemo(() => {
    const safeGoal = Math.max(weeklyGoal, 1);
    const progressRate = Math.min(100, Math.round((weeklyLearnCount / safeGoal) * 100));

    return [
      {
        title: `주간 학습 목표 ${safeGoal}회`,
        value: `${weeklyLearnCount} / ${safeGoal}회 진행`,
        description: `현재 달성률 ${progressRate}%`,
      },
      {
        title: '연속 학습 유지',
        value: `${streakDays}일 연속 학습`,
        description: '매일 짧게라도 이어가는 루틴 만들기',
      },
      {
        title: '발음 점수 안정화',
        value: `${pronunciationScore}점`,
        description: '90점 이상을 목표로 발음 복습 이어가기',
      },
    ];
  }, [pronunciationScore, streakDays, weeklyGoal, weeklyLearnCount]);

  const handleChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: key === 'phoneNumber' ? normalizePhoneNumber(value) : value,
    }));
  };

  const handleStartEditing = () => {
    setForm(buildProfileForm(profileName, profileEmail, user));
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setForm(buildProfileForm(profileName, profileEmail, user));
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    try {
      await userService.updateMe({
        name: form.name.trim() || profileName,
        birthDate: form.birthDate || null,
        address: form.address.trim() || null,
        phoneNumber: form.phoneNumber.trim() || null,
      });

      updateProfileDetails({
        name: form.name.trim() || profileName,
        email: form.email.trim() || profileEmail,
        birthDate: form.birthDate || '',
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        role: form.role.includes('관리') ? 'admin' : 'user',
      });
      setIsEditing(false);
    } catch (error) {
      alert(error.message || '정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await userService.deleteMe();
      localStorage.removeItem('accessToken');
      clearSession();
      navigate('/', { replace: true });
    } catch (error) {
      alert(error.message || '회원 탈퇴에 실패했습니다.');
    }
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="My Profile"
        title="프로필 정보와 현재 학습 상태를 한 화면에서 확인해보세요"
        description="회원 정보, 최근 학습한 장소, 그리고 지금 이어가고 있는 학습 목표를 간단하고 선명하게 정리했어요."
      >
        <section className="mapingo-profile-layout">
          <article className="mapingo-profile-card">
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
                  <p className="mapingo-profile-kicker">Profile Overview</p>
                  <h2>{profileName}</h2>
                  <p>회원 기본 정보를 확인하고 관리할 수 있어요.</p>
                  <div className="mapingo-profile-level-summary">
                    <div className="mapingo-profile-level-summary-head">
                      <span>Level Progress</span>
                      <strong>{levelProgressPercent}%</strong>
                    </div>
                    <div className="mapingo-profile-level-progress">
                      <div
                        className="mapingo-profile-level-progress-fill"
                        style={{ width: `${levelProgressPercent}%` }}
                      />
                    </div>
                    <div className="mapingo-profile-level-summary-foot">
                      <span>누적 경험치 (Cumulative XP)</span>
                      <strong>{`${cumulativeExperience.toLocaleString()} XP`}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mapingo-profile-action-group ${isEditing ? 'is-editing' : ''}`}>
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="mapingo-primary-button"
                      style={{ backgroundColor: 'var(--mapingo-mint)' }}
                      onClick={handleSaveProfile}
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      className="mapingo-ghost-button mapingo-danger-button"
                      onClick={handleDeleteAccount}
                    >
                      계정 탈퇴
                    </button>
                    <button
                      type="button"
                      className="mapingo-ghost-button mapingo-profile-cancel-button"
                      onClick={handleCancelEditing}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="mapingo-ghost-button"
                    onClick={handleStartEditing}
                  >
                    계정 수정
                  </button>
                )}
              </div>
            </div>

            <div className="mapingo-profile-info-list">
              {profileInfoItems.map((item) => (
                <article key={item.key} className="mapingo-profile-info-row">
                  <p className="mapingo-profile-info-label">{item.label}</p>
                  {isEditing && item.editable ? (
                    <input
                      className="mapingo-input mapingo-profile-inline-input"
                      type={item.type}
                      value={form[item.key]}
                      onChange={(event) => handleChange(item.key, event.target.value)}
                      placeholder={`${item.label} 입력`}
                    />
                  ) : (
                    <strong className="mapingo-profile-info-text">{item.value}</strong>
                  )}
                </article>
              ))}
            </div>
          </article>

          <article className="mapingo-profile-side-card mapingo-profile-side-card-unified">
            <div className="mapingo-profile-side-section">
              <div className="mapingo-profile-side-head">
                <div>
                  <p className="mapingo-profile-kicker">Recent Places</p>
                  <h3>최근 학습한 장소 리스트</h3>
                </div>
              </div>

              <div className="mapingo-profile-learning-list">
                {recentLearningPlaces.length > 0 ? (
                  recentLearningPlaces.map((place) => (
                    <article
                      key={`${place.placeId}-${place.endTime}`}
                      className="mapingo-profile-learning-item"
                    >
                      <div className="mapingo-profile-learning-copy">
                        <strong>{place.placeName}</strong>
                        <p>{place.scenarioDescription}</p>
                      </div>

                      <span>{formatRecentTime(place.endTime)}</span>
                    </article>
                  ))
                ) : (
                  <div className="mapingo-profile-empty-state">
                    <strong>아직 최근 학습 기록이 없어요.</strong>
                    <p>첫 장소 학습을 시작하면 여기에 최근 학습한 장소가 표시됩니다.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mapingo-profile-side-divider" />

            <div className="mapingo-profile-side-section">
              <div className="mapingo-profile-side-head">
                <div>
                  <p className="mapingo-profile-kicker">Current Goals</p>
                  <h3>현재 진행중인 학습 목표</h3>
                </div>
              </div>

              <div className="mapingo-profile-goal-list">
                {currentGoalItems.map((goal) => (
                  <article key={goal.title} className="mapingo-profile-goal-item">
                    <strong>{goal.title}</strong>
                    <p>{goal.value}</p>
                    <span>{goal.description}</span>
                  </article>
                ))}
              </div>
            </div>
          </article>
        </section>
      </MapingoPageSection>
    </div>
  );
}

export default ProfilePage;