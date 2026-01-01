import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Truck, Users, Activity, Bell, TrendingUp } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { useWebSocket } from '../contexts/WebSocketContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Dashboard = () => {
    const { predictions, resources, isConnected } = useWebSocket();
    const [liveFeed, setLiveFeed] = useState([]);
    const [activeAlert, setActiveAlert] = useState(false);

    const prediction = predictions && predictions.length > 0 ? predictions[0] : null;

    useEffect(() => {
        // Fetch live feed
        fetch('http://localhost:3000/api/feed')
            .then(res => res.json())
            .then(data => setLiveFeed(data))
            .catch(err => console.error('Failed to fetch feed', err));
    }, []);

    const handleSendAlert = async () => {
        if (!prediction) return;

        setActiveAlert(true);

        try {
            const res = await fetch('http://localhost:3000/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'critical',
                    message: `${prediction.type} WARNING: Evacuate ${prediction.region} immediately. Expected impact in ${prediction.predictedTime}.`,
                    target: prediction.region,
                    region: prediction.region,
                    channels: ['SMS', 'Voice', 'Push', 'Radio']
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`🚨 Alert dispatched to ${prediction.impactEstimate}`, {
                    autoClose: 4000
                });
            }
        } catch (err) {
            toast.error('Failed to dispatch alert');
        } finally {
            setTimeout(() => setActiveAlert(false), 2000);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'Critical': 'var(--accent-danger)',
            'High': 'var(--accent-warning)',
            'Moderate': 'var(--accent-warning)',
            'Low': 'var(--accent-primary)'
        };
        return colors[severity] || 'var(--text-secondary)';
    };

    const totalResources = resources.length;
    const availableResources = resources.filter(r => r.status === 'Available').length;
    const populationAtRisk = prediction ? parseInt(prediction.impactEstimate.split(',')[0].replace(/[^0-9]/g, '')) : 0;

    return (
        <div className="dashboard-grid">
            {/* Top Stats Row */}
            <div className="stat-card glass-panel" style={{ borderLeft: `4px solid ${prediction ? getSeverityColor(prediction.severity) : 'var(--border-color)'}` }}>
                <div className="stat-header">
                    <span className="stat-title">AI Prediction</span>
                    <AlertTriangle color={prediction ? getSeverityColor(prediction.severity) : 'var(--text-muted)'} size={20} />
                </div>
                <div className="stat-value">{prediction ? prediction.type : 'Monitoring...'}</div>
                <div className="stat-meta">
                    {prediction ? (
                        <>
                            Confidence: <span style={{ color: 'var(--accent-success)', fontWeight: '600' }}>{prediction.confidence.toFixed(1)}%</span>
                        </>
                    ) : (
                        'No immediate threats'
                    )}
                </div>
            </div>

            <div className="stat-card glass-panel">
                <div className="stat-header">
                    <span className="stat-title">Active Resources</span>
                    <Truck color="var(--accent-primary)" size={20} />
                </div>
                <div className="stat-value">{totalResources} Units</div>
                <div className="stat-meta">
                    Available: <span style={{ color: 'var(--accent-success)', fontWeight: '600' }}>{availableResources}</span> / {totalResources}
                </div>
            </div>

            <div className="stat-card glass-panel">
                <div className="stat-header">
                    <span className="stat-title">Population at Risk</span>
                    <Users color="var(--accent-warning)" size={20} />
                </div>
                <div className="stat-value">{populationAtRisk > 0 ? populationAtRisk.toLocaleString() : '0'}</div>
                <div className="stat-meta">{prediction?.evacuationZones?.length || 0} Evacuation Zones</div>
            </div>

            <div className="stat-card glass-panel">
                <div className="stat-header">
                    <span className="stat-title">System Status</span>
                    <ShieldCheck color={isConnected ? 'var(--accent-success)' : 'var(--accent-danger)'} size={20} />
                </div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                    {isConnected ? 'Live' : 'Offline'}
                </div>
                <div className="stat-meta">
                    {isConnected ? 'Real-time updates active' : 'Reconnecting...'}
                </div>
            </div>

            {/* Main Map Area */}
            <div className="map-section glass-panel">
                <div className="panel-header">
                    <h3>Live Operations Map</h3>
                    <div className="live-badge">
                        <span className="pulse-dot"></span> LIVE
                    </div>
                </div>
                <div className="map-container">
                    <MapComponent resources={resources} disaster={prediction} />
                </div>
            </div>

            {/* Right Side Control Panel */}
            <div className="control-panel glass-panel">
                <h3>Command Center</h3>

                {prediction && (
                    <div className="alert-box">
                        <h4>⚠ {prediction.severity.toUpperCase()} ALERT</h4>
                        <p style={{ marginBottom: '0.5rem' }}>
                            <strong>{prediction.type}</strong> predicted in {prediction.region}
                        </p>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            marginBottom: '0.75rem'
                        }}>
                            Model: {prediction.aiModel || 'AI-v3.2'} • Radius: {(prediction.radius / 1000).toFixed(1)}km
                        </div>
                        <div className="countdown">
                            Impact in: <span style={{ color: getSeverityColor(prediction.severity) }}>{prediction.predictedTime}</span>
                        </div>

                        {prediction.evacuationZones && prediction.evacuationZones.length > 0 && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                fontSize: '0.85rem'
                            }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Evacuation Zones:
                                </div>
                                {prediction.evacuationZones.map((zone, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.25rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <span>{zone.name} ({zone.priority})</span>
                                        <span>{zone.population?.toLocaleString()} people</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="action-buttons">
                            <button
                                className={`btn ${activeAlert ? 'btn-primary' : 'btn-danger'}`}
                                onClick={handleSendAlert}
                                disabled={activeAlert}
                            >
                                {activeAlert ? 'Dispatching...' : '📢 Broadcast Evacuation Alert'}
                            </button>
                            <button className="btn btn-primary" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                                <Activity size={18} /> Auto-Deploy Resources
                            </button>
                        </div>
                    </div>
                )}

                {!prediction && (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px'
                    }}>
                        <ShieldCheck size={48} style={{ color: 'var(--accent-success)', marginBottom: '1rem' }} />
                        <h4 style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }}>All Clear</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            No immediate threats detected. AI monitoring continues.
                        </p>
                    </div>
                )}

                <div className="feed-list">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={16} />
                        Live Activity Feed
                    </h4>
                    {liveFeed.map((item) => (
                        <div key={item.id} className="feed-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <span className="time">{item.time ? format(new Date(item.time), 'HH:mm') : 'Now'}</span>
                                {item.severity && (
                                    <span className={`badge badge-${item.severity === 'critical' ? 'danger' : item.severity === 'high' ? 'warning' : 'info'}`} style={{ fontSize: '0.7rem' }}>
                                        {item.severity}
                                    </span>
                                )}
                            </div>
                            <p><strong>{item.source}:</strong> {item.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: auto 1fr;
          gap: 16px;
          height: 100%;
          padding-bottom: 20px;
        }

        .stat-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           color: var(--text-secondary);
           font-size: 0.9rem;
        }
        
        .stat-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .stat-meta {
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        .map-section {
            grid-column: span 3;
            display: flex;
            flex-direction: column;
            padding: 20px;
            overflow: hidden;
        }
        
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .map-container {
            flex: 1;
            width: 100%;
            min-height: 400px;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .control-panel {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow-y: auto;
        }

        .alert-box {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 16px;
            border-radius: 12px;
            animation: pulse-glow 3s infinite;
        }

        .alert-box h4 {
            color: var(--accent-danger);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95rem;
        }

        .countdown {
            margin: 12px 0;
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 1rem;
        }

        .feed-list {
            margin-top: auto;
        }
        
        .feed-item {
            padding: 12px 0;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.9rem;
        }
        
        .feed-item:last-child {
            border-bottom: none;
        }

        .feed-item .time {
            color: var(--text-muted);
            font-size: 0.75rem;
            display: block;
            margin-bottom: 4px;
        }

        .feed-item p {
            margin: 0;
            color: var(--text-secondary);
            line-height: 1.4;
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
