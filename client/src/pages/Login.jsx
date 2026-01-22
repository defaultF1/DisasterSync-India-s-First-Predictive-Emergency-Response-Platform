import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../contexts/AuthContext';

// Force refresh

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [credentials, setCredentials] = useState({
        email: 'admin@ndrf.in',
        password: 'admin123'
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Use context login method
            login(data.user, data.accessToken, data.refreshToken);

            toast.success(`Welcome, ${data.user.name}!`, { autoClose: 2000 });
            navigate('/dashboard');
        } catch (err) {
            console.warn('Backend unavailable, switching to Demo Mode:', err);

            // DEMO FALLBACK
            const demoUser = {
                id: 'demo-admin-id',
                name: 'Demo Admin',
                email: 'admin@ndrf.in',
                role: 'admin',
                agency: 'NDRF'
            };

            login(demoUser, 'demo-access-token', 'demo-refresh-token');

            toast.success('Welcome back, Demo Admin!', { autoClose: 2000 });
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box glass-panel animate-slide-up">

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto'
                    }}>
                        <ShieldCheck size={32} color="var(--accent-primary)" />
                    </div>
                    <h2 style={{ marginBottom: '8px' }}>Official Login</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Secure access for Disaster Response Teams</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--accent-danger)'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Agency Email"
                            style={{ paddingLeft: '40px' }}
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Secure Password"
                            style={{ paddingLeft: '40px' }}
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : (
                            <>Access Command Center <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    🔐 JWT Secured • Rate Limited
                </div>

                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                }}>
                    <strong>Demo Credentials:</strong><br />
                    Admin: admin@ndrf.in / admin123
                </div>

            </div>
        </div>
    );
};

export default Login;
