import React, { useState, useEffect } from 'react';
import { Truck, Plane, Home, Fuel, Users, MapPin, Activity, Send } from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { toast } from 'react-toastify';

const ResourceCenter = () => {
    const { resources, isConnected } = useWebSocket();
    const [filter, setFilter] = useState('all');

    const getResourceIcon = (type) => {
        const icons = {
            'Rescue Boat': Truck,
            'Rescue Helicopter': Plane,
            'Ambulance': Truck, // Fallback to Truck to avoid import error
            'Supply Truck': Truck,
            'Shelter': Home
        };
        return icons[type] || Activity;
    };

    const getStatusColor = (status) => {
        const colors = {
            'Available': 'var(--accent-success)',
            'In Transit': 'var(--accent-primary)',
            'Busy': 'var(--accent-warning)',
            'Refueling': 'var(--accent-warning)',
            'Open': 'var(--accent-success)',
            'Full': 'var(--accent-danger)'
        };
        return colors[status] || 'var(--text-secondary)';
    };

    const getFuelColor = (fuel) => {
        const colors = {
            'Full': 'var(--accent-success)',
            'Medium': 'var(--accent-warning)',
            'Low': 'var(--accent-danger)'
        };
        return colors[fuel] || 'var(--text-muted)';
    };

    const handleDispatch = async (resourceId) => {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        try {
            const res = await fetch(`${backendUrl}/api/resources/${resourceId}/dispatch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination: 'Emergency Zone' })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`${data.resource.type} dispatched successfully!`);
            }
        } catch (err) {
            toast.error('Failed to dispatch resource');
        }
    };

    const filteredResources = filter === 'all'
        ? resources
        : resources.filter(r => r.type.toLowerCase().includes(filter.toLowerCase()));

    const availableCount = resources.filter(r => r.status === 'Available').length;
    const busyCount = resources.filter(r => r.status === 'Busy' || r.status === 'In Transit').length;

    return (
        <div style={{ height: '100%', overflow: 'auto', padding: '0 0 20px' }}>
            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div className="metric-card">
                    <div className="metric-label">Total Resources</div>
                    <div className="metric-value">{resources.length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Across all types
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-label">Available</div>
                    <div className="metric-value" style={{ color: 'var(--accent-success)' }}>
                        {availableCount}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Ready for deployment
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-label">Deployed</div>
                    <div className="metric-value" style={{ color: 'var(--accent-warning)' }}>
                        {busyCount}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Currently in use
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-label">Connection</div>
                    <div className="metric-value" style={{ fontSize: '1.2rem' }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: isConnected ? 'var(--accent-success)' : 'var(--accent-danger)'
                        }}>
                            <span className={isConnected ? 'pulse-dot' : ''} style={{
                                width: '10px',
                                height: '10px',
                                background: isConnected ? 'var(--accent-success)' : 'var(--accent-danger)',
                                borderRadius: '50%'
                            }}></span>
                            {isConnected ? 'Live' : 'Offline'}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Real-time tracking
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {['all', 'boat', 'helicopter', 'ambulance', 'truck', 'shelter'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: filter === f ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                color: filter === f ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resources Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {filteredResources.map((resource) => {
                    const Icon = getResourceIcon(resource.type);
                    return (
                        <div key={resource.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon size={24} style={{ color: 'var(--accent-primary)' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{resource.type}</h4>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            ID: {resource.id}
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge badge-${resource.status === 'Available' ? 'success' : 'warning'}`}>
                                    {resource.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                {resource.team && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Users size={16} style={{ color: 'var(--text-muted)' }} />
                                        <span style={{ color: 'var(--text-secondary)' }}>{resource.team}</span>
                                    </div>
                                )}

                                {resource.lat && resource.lng && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            {resource.lat.toFixed(4)}, {resource.lng.toFixed(4)}
                                        </span>
                                    </div>
                                )}

                                {resource.fuel && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Fuel size={16} style={{ color: getFuelColor(resource.fuel) }} />
                                        <span style={{ color: getFuelColor(resource.fuel), fontWeight: '600' }}>
                                            Fuel: {resource.fuel}
                                        </span>
                                    </div>
                                )}

                                {resource.capacity !== undefined && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Activity size={16} style={{ color: 'var(--text-muted)' }} />
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            Capacity: {resource.occupancy !== undefined
                                                ? `${resource.occupancy}/${resource.capacity}`
                                                : resource.capacity}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar for Shelters */}
                            {resource.type === 'Shelter' && resource.capacity && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(resource.occupancy / resource.capacity) * 100}%`,
                                                background: (resource.occupancy / resource.capacity) > 0.8
                                                    ? 'var(--accent-danger)'
                                                    : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        marginTop: '0.25rem'
                                    }}>
                                        <span>Occupancy</span>
                                        <span>{((resource.occupancy / resource.capacity) * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {resource.type !== 'Shelter' && resource.status === 'Available' && (
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', fontSize: '0.9rem' }}
                                    onClick={() => handleDispatch(resource.id)}
                                >
                                    <Send size={16} />
                                    Dispatch to Emergency Zone
                                </button>
                            )}

                            {resource.status !== 'Available' && resource.type !== 'Shelter' && (
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    color: 'var(--accent-warning)',
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}>
                                    Currently {resource.status}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResourceCenter;
