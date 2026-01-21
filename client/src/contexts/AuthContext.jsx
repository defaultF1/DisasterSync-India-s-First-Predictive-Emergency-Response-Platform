import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/apiConfig';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Verify token is still valid
                    const response = await fetch(`${API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        setUser(JSON.parse(storedUser));
                        setIsAuthenticated(true);
                    } else {
                        // Token invalid, clear storage
                        logout();
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // Keep user logged in if server is unreachable (for demo)
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (userData, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const getToken = () => {
        return localStorage.getItem('accessToken');
    };

    // Check if user has required role
    const hasRole = (requiredRoles) => {
        if (!user) return false;
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(user.role);
        }
        return user.role === requiredRoles;
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        getToken,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
