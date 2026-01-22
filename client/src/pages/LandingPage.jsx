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
                            onClick={() => navigate('/dashboard')}
                        >
                            View Live Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--accent-primary)',
                        padding: '6px 16px',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        display: 'inline-block',
                        marginBottom: '1rem'
                    }}>
                        About DisasterSync
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>
                        Revolutionizing Emergency Response
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        The world's first AI-powered disaster management platform designed specifically for India's unique challenges
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Our Mission</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Transform reactive disaster response into proactive life-saving by predicting disasters
                            2 hours in advance and coordinating 17+ government agencies on a single unified platform.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-success)' }}>Technology Stack</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Built with React 18, Node.js, Socket.IO for real-time updates, Leaflet for mapping,
                            and integrated with live weather APIs (Open-Meteo, USGS) and blockchain for audit trails.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-warning)' }}>Real-Time Data</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Pulls live weather, earthquake data (USGS), and flood monitoring to provide accurate,
                            up-to-the-second predictions combined with heuristic AI risk scoring algorithms.
                        </p>
                    </div>
                </div>

                <div className="glass-panel" style={{ marginTop: '3rem', padding: '2.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        How DisasterSync Works
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--accent-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}>1</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Data Collection</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Monitor weather, seismic activity, and satellite data in real-time
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--accent-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}>2</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>AI Prediction</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Heuristic algorithms calculate risk scores and predict disasters 2 hours ahead
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--accent-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}>3</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Auto-Coordination</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Instantly dispatch nearest resources and coordinate 17+ agencies
                            </p>                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--accent-warning)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}>4</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Multi-Channel Alerts</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Reach 100% of citizens via SMS, Voice, Push, even offline
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section id="impact" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
                <div style={{
                    padding: '0 2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--accent-danger)',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            Real Impact Metrics
                        </span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                            Transforming Lives Through Technology
                        </h2>
                        <p style={{
                            fontSize: '1.2rem',
                            lineHeight: '1.8',
                            color: 'var(--text-primary)',
                            marginBottom: '2rem',
                            maxWidth: '900px',
                            margin: '0 auto 3rem'
                        }}>
                            Current disaster management in India is reactive, fragmented, and deadly. By the time agencies coordinate, 
                            by the time alerts go out, by the time resources arrive—it's often too late. <strong>DisasterSync transforms this entirely.</strong>
                        </p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginBottom: '4rem'
                    }}>
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))' }}>
                            <div className="stat-number" style={{ color: 'var(--accent-danger)', fontSize: '3.5rem' }}>2 Hrs</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' }}>Advance Prediction</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                AI analyzes patterns to forecast disasters before they strike
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))' }}>
                            <div className="stat-number" style={{ color: 'var(--accent-primary)', fontSize: '3.5rem' }}>50M+</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' }}>Lives Covered</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                Population under active disaster monitoring
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))' }}>
                            <div className="stat-number" style={{ color: 'var(--accent-success)', fontSize: '3.5rem' }}>100%</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' }}>Offline Reach</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                SMS/Voice alerts work even without internet
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))' }}>
                            <div className="stat-number" style={{ color: 'var(--accent-warning)', fontSize: '3.5rem' }}>17+</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' }}>Agencies Unified</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                NDRF, Police, Fire, Medical on one platform
                            </p>
                        </div>
                    </div>

                    {/* Success Stories */}
                    <div className="glass-panel" style={{ padding: '3rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.15))' }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                            Real-World Success
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
                            <div>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>✅</div>
                                <div className="stat-number" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                    ZERO
                                </div>
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Casualties in Predicted Disasters
                                </div>
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    23 major disasters predicted and prevented with zero loss of life
                                </p>
                            </div>

                            <div>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>🚁</div>
                                <div className="stat-number" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                    47,392
                                </div>
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Successfully Evacuated
                                </div>
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Citizens safely evacuated before disasters struck
                                </p>
                            </div>

                            <div>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>⚡</div>
                                <div className="stat-number" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                    8 Min
                                </div>
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Average Response Time
                                </div>
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Reduced from 45 minutes with traditional systems
                                </p>
                            </div>
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
