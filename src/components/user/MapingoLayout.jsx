import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import MapingoHeader from './MapingoHeader';
import MapingoHero from './MapingoHero';
import { mapingoPalette } from '../data/mapingoData';
import { pathToPage, pageToPath } from '../data/mapingoPageData';
import { useMapingoStore } from '../store/useMapingoStore';
import '../styles/mapingoLanding.css';

function MapingoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useMapingoStore((state) => state.isAuthenticated);
  const clearSession = useMapingoStore((state) => state.clearSession);
  const profileName = useMapingoStore((state) => state.profileName);
  const subscriptionPlan = useMapingoStore((state) => state.subscriptionPlan);
  const subscriptionProductId = useMapingoStore((state) => state.subscriptionProductId);
  const isAdmin = useMapingoStore((state) => (state.session?.user?.role ?? 'user') === 'admin');
  const currentPage = useMemo(() => pathToPage[location.pathname] ?? 'home', [location.pathname]);

  const navigateToPage = (page) => {
    navigate(pageToPath[page] ?? '/');
  };

  const handlePrimaryAction = () => {
    if (currentPage === 'home') {
      navigateToPage('map');
      return;
    }

    if (currentPage === 'growth') {
      navigateToPage('settings');
      return;
    }

    if (currentPage === 'signup') {
      navigateToPage('home');
      return;
    }

    navigateToPage('map');
  };

  const handleSecondaryAction = () => {
    if (currentPage === 'home') {
      navigateToPage('growth');
      return;
    }

    if (currentPage === 'map') {
      navigateToPage('support');
      return;
    }

    navigateToPage('home');
  };

  return (
    <div className="mapingo-app">
      <MapingoHeader
        palette={mapingoPalette}
        currentPage={currentPage}
        onNavigate={navigateToPage}
        isLoggedIn={isAuthenticated}
        isAdmin={isAdmin}
        profileName={profileName}
        subscriptionPlan={subscriptionPlan}
        subscriptionProductId={subscriptionProductId}
        onLogout={() => {
          clearSession();
          navigateToPage('home');
        }}
      />

      <main className="mapingo-page-shell">
        {currentPage === 'home' ? (
          <MapingoHero
            isLoggedIn={isAuthenticated}
            currentPage={currentPage}
            onPrimaryAction={handlePrimaryAction}
            onSecondaryAction={handleSecondaryAction}
          />
        ) : null}
        <Outlet />
      </main>
    </div>
  );
}

export default MapingoLayout;
