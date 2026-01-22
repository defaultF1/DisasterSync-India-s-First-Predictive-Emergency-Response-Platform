import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Siren, Activity, LogOut, BarChart3, Truck, User, HelpCircle, Play, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/analytics')) return 'analytics';
        if (path.includes('/alerts')) return 'alerts';
        if (path.includes('/resources')) return 'resources';
        if (path.includes('/help')) return 'help';
        return 'dashboard';
    };

    const activeTab = getActiveTab();

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        navigate('/');
    };

    return (
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
                <button className={`nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => navigate('/dashboard/help')}>
                    <HelpCircle size={20} />
                    <span>Help</span>
                </button>
                <button className="nav-item logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* User Info */}
            {user && (
                <div className="user-info">
                    <User size={16} />
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                            {user.role} • {user.agency}
                        </div>
                    </div>
                </div>
            )}

            <div className="status-indicator">
                <div className="status-dot"></div>
                System Live
            </div>

            <style>{`
                .sidebar { width: 260px; margin: 16px; padding: 24px; display: flex; flex-direction: column; gap: 1.5rem; border-radius: 20px; }
                .logo-section { display: flex; align-items: center; gap: 12px; font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: white; }
                .nav-links { display: flex; flex-direction: column; gap: 8px; flex: 1; }
                .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; border: none; background: transparent; color: var(--text-secondary); font-family: var(--font-body); font-size: 1rem; cursor: pointer; transition: all 0.2s ease; text-align: left; width: 100%; }
                .nav-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
                .nav-item.active { background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent); color: var(--accent-primary); border-left: 3px solid var(--accent-primary); }
                .nav-item.logout-btn:hover { background: rgba(239, 68, 68, 0.1); color: var(--accent-danger); }
                .user-info { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; color: var(--text-primary); }
                .status-indicator { display: flex; align-items: center; gap: 8px; color: var(--accent-success); font-size: 0.875rem; font-weight: 500; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; }
                .status-dot { width: 8px; height: 8px; background: var(--accent-success); border-radius: 50%; box-shadow: 0 0 10px var(--accent-success); }
            `}</style>
        </nav>
    );
};
export default Sidebar;
