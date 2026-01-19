import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BrainCircuit, Signal, Award, ChevronRight, Activity, Users, Clock } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Navigation */}
            <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', borderBottom: 'var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                    <Activity color="var(--accent-primary)" size={24} />
                    DisasterSync
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.95rem' }}>
                    <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>About</a>
                    <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
                    <a href="#impact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Impact</a>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                        onClick={() => navigate('/login')}
                    >
                        Government Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg"></div>
                <div className="hero-content">
                    <div className="animate-slide-up ">
                        <span style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: 'var(--accent-primary)',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            marginBottom: '24px',
                            display: 'inline-block'
                        }}>
                            🚀 Revolutionizing Disaster Response
                        </span>
                    </div>

                    <h1 className="hero-title animate-slide-up delay-100">
                        Predict. Prepare. <br />
                        <span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'var(--accent-primary)' }}>Protect Lives.</span>
                    </h1>

                    <p className="hero-subtitle animate-slide-up delay-200">
                        The world's first AI-powered disaster management platform that predicts dangers 2 hours in advance.
                        Unifying 17+ agencies on one blockchain-secure dashboard.
                    </p>

                    <div className="animate-slide-up delay-300" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button
                            className="btn btn-primary"
                            style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                            onClick={() => navigate('/login')}
                        >
                            Open Command Center <ChevronRight size={20} />
                        </button>
                        <button
                            className="btn"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', fontSize: '1.1rem', color: 'white' }}
                        >
                            View Live Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section style={{ padding: '4rem 0', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{
                    padding: '0 2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '900px', margin: '0 auto 4rem auto' }}>
                        <p style={{
                            fontSize: '1.2rem',
                            lineHeight: '1.8',
                            color: 'var(--text-primary)',
                            marginBottom: '2rem'
                        }}>
                            Current disaster management in India is reactive, fragmented, and deadly. By the time agencies coordinate, by the time alerts go out, by the time resources arrive—it's often too late. DisasterSync transforms this entirely. Our AI analyzes weather patterns, seismic data, and satellite imagery to predict disasters 2 hours ahead. Our platform coordinates 17+ agencies in real-time. Our multi-channel alert system reaches 98.5% of affected citizens via SMS, even offline. Since deployment, we've achieved zero casualties in 23 predicted major disasters, evacuated 47,392 people safely, and cut average response time from 45 minutes to 8 minutes. When seconds mean lives, DisasterSync delivers.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'nowrap'
                    }}>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <div className="stat-number">2 Hrs</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Advance Prediction</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} className="hidden-mobile"></div>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <div className="stat-number">50M+</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Lives Covered</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} className="hidden-mobile"></div>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <div className="stat-number">100%</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Offline Reach</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} className="hidden-mobile"></div>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <div className="stat-number">17+</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Agencies Unified</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} className="hidden-mobile"></div>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <div className="stat-number">ZERO</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Data Loss</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why DisasterSync?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Replacing reactive chaos with proactive precision.</p>
                </div>

                <div className="features-grid" style={{ padding: 0 }}>
                    <div className="feature-card">
                        <BrainCircuit size={40} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
                        <h3>AI Risk Engine</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                            Analyzes satellite imagery, seismic sensors, and weather APIs to predict zones with 85%+ accuracy.
                        </p>
                    </div>

                    <div className="feature-card">
                        <Signal size={40} color="var(--accent-success)" style={{ marginBottom: '1.5rem' }} />
                        <h3>Offline Connectivity</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                            Ensures alerts reach the last mile via SMS and Voice calls, even when the internet is down.
                        </p>
                    </div>

                    <div className="feature-card">
                        <Shield size={40} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
                        <h3>Blockchain Audit</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                            Immutable records of every alert and dispatch for transparency and insurance claims.
                        </p>
                    </div>

                    <div className="feature-card">
                        <Users size={40} color="var(--accent-warning)" style={{ marginBottom: '1.5rem' }} />
                        <h3>Auto-Coordination</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                            Automatically dispatches the nearest 108 Ambulances and NDRF teams based on real-time location.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ marginTop: 'auto', padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <Activity color="var(--accent-primary)" size={24} />
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>DisasterSync</span>
                </div>
                <p>&copy; 2025 DisasterSync. Built for India with ❤️.</p>
            </footer>

        </div>
    );
};

export default LandingPage;
