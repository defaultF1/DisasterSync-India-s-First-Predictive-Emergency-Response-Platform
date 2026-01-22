import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Truck, Users, Activity, Bell, TrendingUp, Play } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { useWebSocket } from '../contexts/WebSocketContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { API_URL } from '../utils/apiConfig';

const Dashboard = () => {
    const { predictions, resources, isConnected, setPredictions, simulationTrigger } = useWebSocket();
    const [liveFeed, setLiveFeed] = useState([]);
    const [earthquakes, setEarthquakes] = useState([]);
    const [weather, setWeather] = useState(null);
    const [activeAlert, setActiveAlert] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const prediction = predictions && predictions.length > 0 ? predictions[0] : null;

    useEffect(() => {
        if (simulationTrigger) {
            handleSimulate();
        }
    }, [simulationTrigger]);

    const speak = (text, delay = 0) => {
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }, delay);
    };

    const handleSimulate = () => {
        if (isSimulating) return; // Prevent double trigger
        setIsSimulating(true);
        toast.info("🎙️ Starting System Tour & Simulation...");

        // Stop any current speech
        window.speechSynthesis.cancel();

        // 1. System Tour Sequence
        const tourSteps = [
            { t: 0, msg: "Welcome to Disaster Sync Command Center. Initializing System Overview." },
            { t: 4000, msg: "You are observing the Real-time Operations Dashboard, tracking live satellite feeds and weather anomalies." },
            { t: 11000, msg: "Our AI Prediction Engine analyzes historic seismic and meteorological data to forecast threats with 98% accuracy." },
            { t: 19000, msg: "The Resource Manager tracks nearby rescue units, hospitals, and logistical support in real-time." },
            { t: 26000, msg: "The Alert System enables instant multi-channel dissemination to ground teams and civilians." },
            { t: 33000, msg: "Initiating Live Simulation now... Attention. Anomaly detected in Northern Sector..." },
            { t: 38000, msg: "Analyzing... Confirmed. Critical Flash Flood monitoring in Rishikesh." },
            { t: 44000, msg: "Impact Assessment complete. 15,000 civilians at risk. Evacuation protocols recommended." }
        ];

        // Schedule Narration
        tourSteps.forEach(step => speak(step.msg, step.t));

        // 2. Clear current predictions
        setPredictions([]);

        // 3. Inject New Disaster aligned with narration (approx 38s in)
        setTimeout(() => {
            const simulatedDisaster = {
                id: 999,
                type: 'Flash Flood',
                severity: 'Critical',
                region: 'Rishikesh, Uttarakhand',
                coordinates: [30.0869, 78.2676], // Rishikesh Coords
                predictedTime: '45 Mins',
                confidence: 98,
                impactEstimate: '15,000 People at Risk',
                radius: 12000,
                aiModel: 'HydroNet-X',
                evacuationZones: [
                    { name: 'Ghat Area', priority: 'High', population: 5000 },
                    { name: 'Market Rd', priority: 'High', population: 8000 }
                ]
            };
            setPredictions([simulatedDisaster]);

            toast.error(`⚠️ CRITICAL: Flash Flood detected in Rishikesh!`, {
                position: "top-center",
                autoClose: 8000,
                theme: "dark",
            });
            setIsSimulating(false);
        }, 38000); // Sync with "Confirmed..." message
    };

    useEffect(() => {
        // HYBRID MODE: Fetch real earthquake data DIRECTLY from USGS (no backend needed)
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
            .then(res => res.json())
            .then(data => {
                const quakes = data.features.slice(0, 10).map(eq => ({
                    id: eq.id,
                    magnitude: eq.properties.mag,
                    place: eq.properties.place,
                    time: new Date(eq.properties.time),
                    coordinates: [eq.geometry.coordinates[1], eq.geometry.coordinates[0]], // Swap [lng, lat] to [lat, lng]
                    depth: eq.geometry.coordinates[2]
                }));
                setEarthquakes(quakes);
            })
            .catch(err => console.log('Using mock earthquake data'));

        // HYBRID MODE: Fetch real weather data DIRECTLY from Open-Meteo (no backend needed)
        fetch('https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia/Kolkata')
            .then(res => res.json())
            .then(data => {
                setWeather(data.current);
            })
            .catch(err => console.log('Using mock weather data'));

        // DEMO: Use mock live feed (already in WebSocketContext, but set local fallback)
        setLiveFeed([
            { id: 1, time: new Date().toISOString(), source: 'IMD API', message: 'Heavy rainfall alert (150mm) received.', severity: 'high' },
            { id: 2, time: new Date(Date.now() - 300000).toISOString(), source: 'NDRF HQ', message: 'Team Alpha deployed to coastal region.', severity: 'medium' },
            { id: 3, time: new Date(Date.now() - 600000).toISOString(), source: 'USGS', message: 'Minor seismic activity detected near Himalayan region.', severity: 'low' }
        ]);
    }, []);

    // Also update live feed
    useEffect(() => {
        if (prediction) {
            setActiveAlert(true);
            setLiveFeed(prev => [
                { id: Date.now(), message: `CRITICAL ALERT: ${prediction.type} detected in ${prediction.region}`, type: 'alert', time: 'Just Now' },
                ...prev
            ]);
        }
    }, [prediction]);

    const handleSendAlert = async () => {
        if (!prediction) return;

        setActiveAlert(true);

        // DEMO MODE: Simulate successful alert dispatch without backend
        setTimeout(() => {
            toast.success(`🚨 Alert dispatched to ${prediction.impactEstimate}`, {
                autoClose: 4000
            });
            setActiveAlert(false);
        }, 1500);
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
            <div className="stat-card glass-panel" style={{ borderLeft: `4px solid ${prediction ? getSeverityColor(prediction.severity) : 'var(--accent-primary)'}` }}>
                <div className="stat-header">
                    <span className="stat-title">{prediction ? 'AI Prediction' : 'Live Weather (Delhi)'}</span>
                    <AlertTriangle color={prediction ? getSeverityColor(prediction.severity) : 'var(--text-muted)'} size={20} />
                </div>
                <div className="stat-value">
                    {prediction ? prediction.type : (weather ? `${weather.temp}°C ${weather.weather}` : 'Monitoring...')}
                </div>
                <div className="stat-meta">
                    {prediction ? (
                        <>
                            Confidence: <span style={{ color: 'var(--accent-success)', fontWeight: '600' }}>{prediction.confidence.toFixed(1)}%</span>
                        </>
                    ) : (
                        weather ? `Humidity: ${weather.humidity}% • Wind: ${weather.windSpeed} km/h` : 'No immediate threats'
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
                    <MapComponent resources={resources} disaster={prediction} earthquakes={earthquakes} />
                </div>
            </div>

            {/* Right Side Control Panel */}
            <div className="control-panel glass-panel">
                <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
                    <h3>Command Center</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? 'var(--accent-success)' : 'var(--accent-danger)' }}></span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
                    </div>
                </div>

                {/* Simulation Control */}
                <div className="control-group">
                    <label className="group-label">Simulation</label>
                    <button
                        className="btn btn-outline-danger full-width"
                        style={{ justifyContent: 'space-between' }}
                        onClick={async () => {
                            try {
                                toast.info("🚨 DEMO: Initiating Force Disaster Sequence...");
                                await fetch(`${API_URL}/api/force-disaster`, { method: 'POST' });
                            } catch (e) {
                                toast.error("Failed to trigger disaster");
                            }
                        }}
                        title="Trigger +50 wind speed anomaly"
                    >
                        <span>Trigger Emergency Scenario</span>
                        <Play size={14} />
                    </button>
                </div>

                {/* Alert/Status Display */}
                {prediction ? (
                    <div className="alert-box animate-pulse-glow" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4>
                                <AlertTriangle size={18} />
                                {prediction.severity} Alert
                            </h4>
                            <span className="badge badge-danger">Active</span>
                        </div>

                        <p style={{ margin: '8px 0', fontSize: '1.1rem', fontWeight: '600' }}>
                            {prediction.type} in {prediction.region}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>IMPACT IN</span>
                                <span style={{ fontWeight: '700', color: getSeverityColor(prediction.severity) }}>{prediction.predictedTime}</span>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONFIDENCE</span>
                                <span style={{ fontWeight: '700', color: 'var(--accent-success)' }}>{prediction.confidence}%</span>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                className={`btn ${activeAlert ? 'btn-primary' : 'btn-danger'} full-width`}
                                onClick={handleSendAlert}
                                disabled={activeAlert}
                            >
                                {activeAlert ? '✅ Protocols Activated' : '📢 Broadcast Evacuation Alert'}
                            </button>
                            
                            <button
                                className="btn btn-primary full-width"
                                style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}
                                onClick={async () => {
                                    if (!prediction) return;
                                    
                                    // Find first available resource
                                    const availableResource = resources.find(r => r.status === 'Available');
                                    
                                    if (!availableResource) {
                                        toast.warning("No resources currently available for dispatch.");
                                        return;
                                    }

                                    toast.info(`🚁 Dispatching ${availableResource.type} to ${prediction.region}...`);
                                    
                                    try {
                                        await fetch(`${API_URL}/api/resources/${availableResource.id}/dispatch`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                destination: prediction.region,
                                                targetCoordinates: prediction.coordinates
                                            })
                                        });
                                        toast.success("✅ Unit Deployed & En Route!");
                                    } catch (e) {
                                        console.error(e);
                                        toast.error("Dispatch Failed");
                                    }
                                }}
                            >
                                <Activity size={18} /> Auto-Deploy Resources
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="control-group">
                        <div className="status-indicator">
                            <ShieldCheck size={32} style={{ color: 'var(--accent-success)' }} />
                            <div>
                                <div style={{ color: 'var(--accent-success)', fontWeight: '600' }}>System Normal</div>
                                <div style={{ fontSize: '0.8rem' }}>AI Monitoring Active</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="divider" style={{ margin: '1rem 0' }}></div>

                {/* Communication Control */}
                <div className="control-group">
                    <label className="group-label">Last Mile Connectivity (Demo)</label>
                    <div className="input-group">
                        <input
                            type="tel"
                            placeholder="+91 Phone Number"
                            id="citizen-phone"
                            className="custom-input"
                            style={{ fontSize: '0.9rem', padding: '8px 12px' }}
                        />
                        <button
                            className="btn btn-primary"
                            style={{ padding: '8px 16px' }}
                            onClick={async () => {
                                const phone = document.getElementById('citizen-phone').value;
                                if (!phone) return toast.warning("Enter a phone number");

                                toast.info(`📨 Sending Priority SMS to ${phone}...`);
                                try {
                                    await fetch(`${API_URL}/api/alerts/sms`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            phoneNumber: phone,
                                            message: "CRITICAL: Flash Flood detected. Evacuate immediately to High Ground Zone A."
                                        })
                                    });
                                    toast.success("✅ SMS Delivered");
                                } catch (e) {
                                    toast.error("SMS Failed");
                                }
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="feed-section compact-feed">
                    <div className="feed-header">
                        <Activity size={14} />
                        <span>Live Activity Feed</span>
                    </div>
                    <div className="scrollable" style={{ flex: 1 }}>
                        {liveFeed.map((item) => (
                            <div key={item.id} className="feed-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.source}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                        {item.time === 'Just Now' ? 'Just Now' : (item.time ? format(new Date(item.time), 'HH:mm') : 'Now')}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{item.message}</p>
                            </div>
                        ))}
                    </div>
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
        
        @media screen and (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media screen and (max-width: 600px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
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
