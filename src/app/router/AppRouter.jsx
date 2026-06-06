import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../../shared/layouts/AppLayout";

import LoginPage from "../../features/auth/pages/LoginPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import MatchesPage from "../../features/matches/pages/MatchesPage";
import LeaderboardPage from "../../features/leaderboard/pages/LeaderboardPage";
import RulesPage from "../../features/rules/pages/RulesPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import ProtectedRoute from "../../shared/components/ProtectedRoute"

const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<LoginPage />} />
            
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter