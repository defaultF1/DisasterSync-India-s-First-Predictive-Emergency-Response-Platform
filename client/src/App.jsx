import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, Siren, Activity, LogOut, BarChart3, Truck } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { WebSocketProvider } from './contexts/WebSocketContext';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import AlertManagement from './pages/AlertManagement';
import ResourceCenter from './pages/ResourceCenter';

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/alerts')) return 'alerts';
    if (path.includes('/resources')) return 'resources';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div className="app-container">
      <nav className="sidebar glass-panel">
        <div className="logo-section">
          <Activity size={32} className="logo-icon" color="var(--accent-primary)" />
          <span className="logo-text">DisasterSync</span>
        </div>

        <div className="nav-links">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => navigate('/dashboard/analytics')}>
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => navigate('/dashboard/alerts')}>
            <Siren size={20} />
            <span>Alerts</span>
          </button>
          <button className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => navigate('/dashboard/resources')}>
            <Truck size={20} />
            <span>Resources</span>
          </button>
        </div>

        <div className="mt-auto">
          <button className="nav-item" onClick={() => navigate('/')}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="status-indicator">
          <div className="status-dot"></div>
          System Live
        </div>
      </nav>

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
          </Routes>
        </div>
      </main>

      <style>{`
        .app-container { display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 260px; margin: 16px; padding: 24px; display: flex; flex-direction: column; gap: 2rem; border-radius: 20px; }
        .logo-section { display: flex; align-items: center; gap: 12px; font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: white; }
        .nav-links { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; border: none; background: transparent; color: var(--text-secondary); font-family: var(--font-body); font-size: 1rem; cursor: pointer; transition: all 0.2s ease; text-align: left; width: 100%; }
        .nav-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
        .nav-item.active { background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent); color: var(--accent-primary); border-left: 3px solid var(--accent-primary); }
        .status-indicator { display: flex; align-items: center; gap: 8px; color: var(--accent-success); font-size: 0.875rem; font-weight: 500; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; }
        .status-dot { width: 8px; height: 8px; background: var(--accent-success); border-radius: 50%; box-shadow: 0 0 10px var(--accent-success); }
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
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      </WebSocketProvider>
    </Router>
  );
}

export default App;
