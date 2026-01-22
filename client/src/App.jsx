import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { WebSocketProvider } from './contexts/WebSocketContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import AlertManagement from './pages/AlertManagement';
import ResourceCenter from './pages/ResourceCenter';
import HelpCenter from './pages/HelpCenter';
import Sidebar from './components/Sidebar';

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/alerts')) return 'alerts';
    if (path.includes('/resources')) return 'resources';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <header className="top-bar glass-panel">
          <div className="breadcrumbs">
            <span className="text-muted">Command Center / </span>
            <span className="current-page">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          </div>
          <div className="user-profile">
            <div className="server-status">
              <span className="pulse-dot"></span>
              AI Prediction Engine: <strong>Online</strong>
            </div>
          </div>
        </header>

        <div className="content-area animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<AlertManagement />} />
            <Route path="/resources" element={<ResourceCenter />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </div>
      </main>

      <style>{`
        .app-container { display: flex; height: 100vh; overflow: hidden; }
        .main-content { flex: 1; display: flex; flex-direction: column; margin: 16px 16px 16px 0; gap: 16px; }
        .top-bar { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; height: 70px; }
        .server-status { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--text-secondary); }
        .pulse-dot { width: 6px; height: 6px; background: var(--accent-primary); border-radius: 50%; animation: pulse-glow 1.5s infinite; }
        .content-area { flex: 1; overflow-y: auto; padding: 0 16px; }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
