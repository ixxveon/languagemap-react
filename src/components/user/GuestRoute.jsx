import { Navigate, Outlet } from 'react-router-dom';
import { useMapingoStore } from '../store/useMapingoStore';

function GuestRoute({ redirectTo = '/' }) {
  const isAuthenticated = useMapingoStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
