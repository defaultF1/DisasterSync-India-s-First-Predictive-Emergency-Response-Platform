import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Clock, Users, Award, Activity } from 'lucide-react';

import { API_URL } from '../utils/apiConfig';
import axios from 'axios'; // Assuming axios is available or needs to be imported

const Analytics = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch analytics data
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/analytics`);
                setData(response.data);
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            }
        };
        fetchData();
    }, []);

    const predictionTrendData = [
        { month: 'Jan', predictions: 32, accurate: 28 },
        { month: 'Feb', predictions: 28, accurate: 26 },
        { month: 'Mar', predictions: 35, accurate: 32 },
        { month: 'Apr', predictions: 42, accurate: 38 },
        { month: 'May', predictions: 47, accurate: 42 },
        { month: 'Jun', predictions: 38, accurate: 34 }
    ];

    const disasterTypeData = [
        { name: 'Floods', value: 45, color: '#3b82f6' },
        { name: 'Earthquakes', value: 25, color: '#8b5cf6' },
        { name: 'Landslides', value: 20, color: '#f59e0b' },
        { name: 'Storms', value: 10, color: '#10b981' }
    ];

    const responseTimeData = [
        { agency: 'NDRF', time: 15 },
        { agency: 'Police', time: 10 },
        { agency: 'Fire', time: 12 },
        { agency: 'Medical', time: 8 },
        { agency: 'Army', time: 30 }
    ];

    const weeklyAlerts = [
        { day: 'Mon', alerts: 12 },
        { day: 'Tue', alerts: 15 },
        { day: 'Wed', alerts: 8 },
        { day: 'Thu', alerts: 18 },
        { day: 'Fri', alerts: 14 },
        { day: 'Sat', alerts: 10 },
        { day: 'Sun', alerts: 7 }
    ];

    return (
        <div style={{ height: '100%', overflow: 'auto', padding: '0 0 20px' }}>
            {/* Top Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <div className="metric-label">Accuracy Rate</div>
                            <div className="metric-value">{data?.accuracyRate || 89.5}%</div>
                            <div className="metric-change positive">↑ 5.2% from last month</div>
                        </div>
                        <Target size={32} style={{ color: 'var(--accent-primary)', opacity: 0.3 }} />
                    </div>
                </div>

                <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <div className="metric-label">Avg Response Time</div>
                            <div className="metric-value">{data?.avgResponseTime || '18 min'}</div>
                            <div className="metric-change positive">↓ 3 min improvement</div>
                        </div>
                        <Clock size={32} style={{ color: 'var(--accent-success)', opacity: 0.3 }} />
                    </div>
                </div>

                <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <div className="metric-label">Lives Protected</div>
                            <div className="metric-value">{(data?.livesImpacted || 125000).toLocaleString()}</div>
                            <div className="metric-change positive">↑ 12,000 this quarter</div>
                        </div>
                        <Users size={32} style={{ color: 'var(--accent-warning)', opacity: 0.3 }} />
                    </div>
                </div>

                <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <div className="metric-label">Success Rate</div>
                            <div className="metric-value">94.8%</div>
                            <div className="metric-change positive">↑ 2.1% improved</div>
                        </div>
                        <Award size={32} style={{ color: 'var(--accent-secondary)', opacity: 0.3 }} />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
            }}>
                {/* Prediction Trends */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
                        Prediction Accuracy Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={predictionTrendData}>
                            <defs>
                                <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorAccurate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#f8fafc'
                                }}
                            />
                            <Area type="monotone" dataKey="predictions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPredictions)" />
                            <Area type="monotone" dataKey="accurate" stroke="#10b981" fillOpacity={1} fill="url(#colorAccurate)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Disaster Distribution */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} style={{ color: 'var(--accent-secondary)' }} />
                        Disaster Type Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={disasterTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}% `}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {disasterTypeData.map((entry, index) => (
                                    <Cell key={`cell - ${index} `} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#f8fafc'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Response Times */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} style={{ color: 'var(--accent-success)' }} />
                        Agency Response Times
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={responseTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                            <XAxis dataKey="agency" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#f8fafc'
                                }}
                            />
                            <Bar dataKey="time" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly Alerts */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} style={{ color: 'var(--accent-danger)' }} />
                        Weekly Alert Activity
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={weeklyAlerts}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                            <XAxis dataKey="day" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#f8fafc'
                                }}
                            />
                            <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Platform Impact Summary</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                            {data?.predictionsLast30Days || 47}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Predictions (30 days)
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-success)' }}>
                            {data?.successfulEvacuations || 42}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Successful Evacuations
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-warning)' }}>
                            {data?.resourcesDeployed || 234}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Resources Deployed
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-secondary)' }}>
                            {data?.agenciesCoordinated || 17}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Agencies Coordinated
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
