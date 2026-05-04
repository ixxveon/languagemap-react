import NavButton from './NavButton';
import PingPopStarterLogo from './PingPopStarterLogo';

function MapingoHeader({
  palette,
  currentPage,
  onNavigate,
  isLoggedIn,
  isAdmin,
  onLogout,
  profileName,
  subscriptionPlan,
  subscriptionProductId,
}) {
  const subscriptionLabel =
    subscriptionPlan === 'Premium'
      ? subscriptionProductId === 'monthly'
        ? 'Premium Monthly'
        : 'Premium Yearly'
      : 'Free Plan';

  return (
    <header className="mapingo-header">
      <div className="mapingo-header-inner">
        <button type="button" className="mapingo-brand" onClick={() => onNavigate('home')}>
          <div className="mapingo-brand-logo-shell">
            <PingPopStarterLogo className="mapingo-brand-logo" />
          </div>
          <div className="mapingo-brand-copy">
            <p className="mapingo-brand-title" style={{ color: palette.point }}>
              Mapingo
            </p>
            <p className="mapingo-brand-subtitle">Learn English on the map</p>
          </div>
        </button>

        <nav className="mapingo-nav">
          <NavButton active={currentPage === 'home'} onClick={() => onNavigate('home')}>
            홈
          </NavButton>
          <NavButton active={currentPage === 'map'} onClick={() => onNavigate('map')}>
            지도 학습
          </NavButton>
          <NavButton active={currentPage === 'coaching'} onClick={() => onNavigate('coaching')}>
            AI 코칭
          </NavButton>
          <NavButton active={currentPage === 'growth'} onClick={() => onNavigate('growth')}>
            성장 리포트
          </NavButton>
          <NavButton active={currentPage === 'community'} onClick={() => onNavigate('community')}>
            커뮤니티
          </NavButton>
          <NavButton active={currentPage === 'support'} onClick={() => onNavigate('support')}>
            고객지원
          </NavButton>
          <NavButton active={currentPage === 'premium'} onClick={() => onNavigate('premium')}>
            프리미엄
          </NavButton>
          <NavButton active={currentPage === 'settings'} onClick={() => onNavigate('settings')}>
            환경설정
          </NavButton>
        </nav>

        <div className="mapingo-auth">
          {isLoggedIn ? (
            <>
              <div className="mapingo-session-pill">
                <span className="mapingo-session-name">{profileName}</span>
                <span className="mapingo-session-plan">{subscriptionLabel}</span>
              </div>
              <button
                type="button"
                className="mapingo-ghost-button"
                onClick={() => onNavigate('profile')}
                style={{ borderColor: '#CDEFEA', color: palette.point }}
              >
                프로필
              </button>
              {isAdmin ? (
                <button
                  type="button"
                  className="mapingo-ghost-button"
                  onClick={() => onNavigate('admin')}
                  style={{ borderColor: '#CDEFEA', color: palette.point }}
                >
                  관리자
                </button>
              ) : null}
              <button
                type="button"
                className="mapingo-primary-button"
                style={{ backgroundColor: palette.main }}
                onClick={onLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="mapingo-ghost-button"
                onClick={() => onNavigate('signup')}
                style={{ borderColor: '#CDEFEA', color: palette.point }}
              >
                회원가입
              </button>
              <button
                type="button"
                className="mapingo-primary-button"
                style={{ backgroundColor: palette.main }}
                onClick={() => onNavigate('login')}
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default MapingoHeader;
