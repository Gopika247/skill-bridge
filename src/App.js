import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/contexts/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import SkillGapPage from "./pages/SkillGapPage";
import SkillDetailPage from "./pages/SkillDetailPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import MiniProjectsPage from "./pages/MiniProjectsPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import AIMentorPage from "./pages/AIMentorPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CareerDetailsPage from "./pages/CareerDetailsPage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useApp();
    if (authLoading)
        return _jsx(LoadingSpinner, { message: "Loading..." });
    if (!user.isLoggedIn)
        return _jsx(Navigate, { to: "/", replace: true });
    return _jsx(_Fragment, { children: children });
};
const OnboardingGuard = () => {
    const { user } = useApp();
    if (user.onboardingComplete)
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    return _jsx(OnboardingPage, {});
};
const AppRoutes = () => {
    const { user, authLoading } = useApp();
    if (authLoading)
        return _jsx(LoadingSpinner, { message: "Loading..." });
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: user.isLoggedIn ? _jsx(Navigate, { to: user.onboardingComplete ? "/dashboard" : "/onboarding", replace: true }) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/onboarding", element: _jsx(ProtectedRoute, { children: _jsx(OnboardingGuard, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/skill-gap", element: _jsx(ProtectedRoute, { children: _jsx(SkillGapPage, {}) }) }), _jsx(Route, { path: "/skill-detail/:skill", element: _jsx(ProtectedRoute, { children: _jsx(SkillDetailPage, {}) }) }), _jsx(Route, { path: "/daily-challenges", element: _jsx(ProtectedRoute, { children: _jsx(DailyChallengePage, {}) }) }), _jsx(Route, { path: "/mini-projects", element: _jsx(ProtectedRoute, { children: _jsx(MiniProjectsPage, {}) }) }), _jsx(Route, { path: "/resume-builder", element: _jsx(ProtectedRoute, { children: _jsx(ResumeBuilderPage, {}) }) }), _jsx(Route, { path: "/ai-mentor", element: _jsx(ProtectedRoute, { children: _jsx(AIMentorPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "/career-details", element: _jsx(ProtectedRoute, { children: _jsx(CareerDetailsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }));
};
const App = () => (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AppProvider, { children: _jsxs(TooltipProvider, { children: [_jsx(Toaster, {}), _jsx(Sonner, {}), _jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) })] }) }) }));
export default App;
