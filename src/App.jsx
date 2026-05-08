import { Navigate, Route, Routes } from 'react-router-dom';
import MapingoLayout from './components/user/MapingoLayout';
import LandingHomePage from './pages/home-support-common/LandingHomePage';
import MapPage from './pages/place/MapPage';
import GrowthPage from './pages/history-analysis/GrowthPage';
import GrowthProgressPage from './pages/history-analysis/GrowthProgressPage';
import GrowthInsightsPage from './pages/history-analysis/GrowthInsightsPage';
import CommunityPage from './pages/community/CommunityPage';
import CommunityFriendsPage from './pages/community/CommunityFriendsPage';
import CommunityRankingPage from './pages/community/CommunityRankingPage';
import CommunityFavoritesPage from './pages/community/CommunityFavoritesPage';
import SupportPage from './pages/home-support-common/SupportPage';
import PremiumPage from './pages/primium/PremiumPage';
import PremiumPlansPage from './pages/primium/PremiumPlansPage';
import PremiumCheckoutPage from './pages/primium/PremiumCheckoutPage';
import SettingsPage from './pages/home-support-common/SettingsPage';
import SettingsLearningPage from './pages/home-support-common/SettingsLearningPage';
import SettingsAccountPage from './pages/home-support-common/SettingsAccountPage';
import AccountDeletePage from './pages/user/AccountDeletePage';
import AdminPage from './pages/admin/AdminPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminNoticesPage from './pages/admin/AdminNoticesPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminCommunityPage from './pages/admin/AdminCommunityPage';
import AdminCoachingPage from './pages/admin/AdminCoachingPage';
import AdminGrowthPage from './pages/admin/AdminGrowthPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import SignupPage from './pages/user/SignupPage';
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/user/LoginPage';
import ProtectedRoute from './components/user/ProtectedRoute';
import GuestRoute from './components/user/GuestRoute';
import CoachingPage from './pages/coaching/CoachingPage';
import OAuthSuccessPage from './pages/user/OAuthSuccessPage';
import ProfileSetupPage from './pages/user/ProfileSetupPage';
import OAuthFailurePage from './pages/user/OAuthFailurePage';




function App() {
  return (
    <Routes>
      <Route element={<MapingoLayout />}>
        <Route path="/" element={<LandingHomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/coaching" element={<CoachingPage />} />
        <Route path="/growth" element={<GrowthPage />} />
        <Route path="/growth/progress" element={<GrowthProgressPage />} />
        <Route path="/growth/goals" element={<Navigate to="/growth/insights" replace />} />
        <Route path="/growth/insights" element={<GrowthInsightsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/friends" element={<CommunityFriendsPage />} />
        <Route path="/community/ranking" element={<CommunityRankingPage />} />
        <Route path="/community/favorites" element={<CommunityFavoritesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium/plans" element={<PremiumPlansPage />} />
        <Route path="/premium/features" element={<Navigate to="/premium/plans" replace />} />
        <Route path="/premium/status" element={<Navigate to="/premium/plans" replace />} />
        <Route path="/premium/checkout" element={<PremiumCheckoutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/learning" element={<SettingsLearningPage />} />
        <Route path="/settings/account" element={<SettingsAccountPage />} />
        <Route path="/settings/account/delete" element={<AccountDeletePage />} />
        <Route path="/profile/setup" element={<ProfileSetupPage />} />
        <Route path="/oauth/success" element={<OAuthSuccessPage />} />
        <Route path="/oauth/failure" element={<OAuthFailurePage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/members" element={<AdminMembersPage />} />
          <Route path="/admin/notices" element={<AdminNoticesPage />} />
          <Route path="/admin/support" element={<AdminNoticesPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/community" element={<AdminCommunityPage />} />
          <Route path="/admin/coaching" element={<AdminCoachingPage />} />
          <Route path="/admin/growth" element={<AdminGrowthPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
