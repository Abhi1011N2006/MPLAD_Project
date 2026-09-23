import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DemoNoticeBanner from './components/common/DemoNoticeBanner';
import OfflineSyncBadge from './components/common/OfflineSyncBadge';
import BottomMetricsBar from './components/common/BottomMetricsBar';

import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import MapPage from './pages/MapPage';
import WeeklyReports from './pages/WeeklyReports';
import CitizenReports from './pages/CitizenReports';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Scenarios from './pages/Scenarios';
import Tenders from './pages/Tenders';
import ContractorProfilePage from './pages/ContractorProfilePage';
import ContractorHistory from './pages/ContractorHistory';
import ContractorContracts from './pages/ContractorContracts';
import ContractorPayments from './pages/ContractorPayments';

export default function App() {
  return (
    <AccessibilityProvider>
      <RoleProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
            {/* Sticky Header Bar with Built-in Accessibility Tools */}
            <Header />

            {/* Synthetic Demo Banner */}
            <DemoNoticeBanner />

            {/* Offline Sync Status Bar */}
            <OfflineSyncBadge />

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Navigation Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <main id="main-content" className="flex-1 p-5 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                  <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
                  <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><WeeklyReports /></ProtectedRoute>} />
                  <Route path="/citizen-reports" element={<ProtectedRoute><CitizenReports /></ProtectedRoute>} />
                  <Route path="/tenders" element={<ProtectedRoute><Tenders /></ProtectedRoute>} />
                  <Route path="/contractor/profile" element={<ProtectedRoute><ContractorProfilePage /></ProtectedRoute>} />
                  <Route path="/contractor/history" element={<ProtectedRoute><ContractorHistory /></ProtectedRoute>} />
                  <Route path="/contractor/contracts" element={<ProtectedRoute><ContractorContracts /></ProtectedRoute>} />
                  <Route path="/contractor/payments" element={<ProtectedRoute><ContractorPayments /></ProtectedRoute>} />
                  <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/scenarios" element={<ProtectedRoute><Scenarios /></ProtectedRoute>} />
                </Routes>
              </main>
            </div>

            {/* Signature Telemetry Bottom Bar */}
            <BottomMetricsBar />
          </div>
        </Router>
      </RoleProvider>
    </AccessibilityProvider>
  );
}
