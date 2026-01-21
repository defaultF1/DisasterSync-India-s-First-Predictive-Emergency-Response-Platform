import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRoles = null }) => {
    const { isAuthenticated, loading, hasRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'var(--bg-primary)'
            }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login, saving the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if required
    if (requiredRoles && !hasRole(requiredRoles)) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h2 style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>
                    🚫 Access Denied
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    You don't have permission to access this page.
                </p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
