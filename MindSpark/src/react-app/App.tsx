import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { LanguageProvider } from "@/react-app/hooks/useLanguage";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import DashboardPage from "@/react-app/pages/Dashboard";
import OnboardingPage from "@/react-app/pages/Onboarding";
import SchedulePage from "@/react-app/pages/Schedule";
import InterestsPage from "@/react-app/pages/Interests";
import ActivityPage from "@/react-app/pages/Activity";
import StatsPage from "@/react-app/pages/Stats";
import SettingsPage from "@/react-app/pages/Settings";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/interests" element={<InterestsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
