import { Navigate } from 'react-router-dom';

// Deprecated: learning settings moved to Growth > Insights.
export default function SettingsLearningPage() {
  return <Navigate to="/growth/insights" replace />;
}
