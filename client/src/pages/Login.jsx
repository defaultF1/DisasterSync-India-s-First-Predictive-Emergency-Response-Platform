import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate Auth
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
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

                <form onSubmit={handleLogin}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Agency ID / Username"
                            style={{ paddingLeft: '40px' }}
                            defaultValue="admin@ndrf.gov.in"
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Secure Pin"
                            style={{ paddingLeft: '40px' }}
                            defaultValue="123456"
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
                    Restricted System • Secured by Hyperledger
                </div>

            </div>
        </div>
    );
};

export default Login;
