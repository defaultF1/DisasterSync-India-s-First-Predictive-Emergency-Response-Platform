import React, { useState, useEffect } from 'react';
import { Bell, Send, CheckCircle, AlertCircle, Radio, Smartphone, Volume2, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const AlertManagement = () => {
    const [alertHistory, setAlertHistory] = useState([]);
    const [newAlert, setNewAlert] = useState({
        type: 'warning',
        message: '',
        region: '',
        channels: []
    });

    useEffect(() => {
        fetchAlertHistory();
    }, []);

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${backendUrl}/api/alerts/history`);
        const data = await res.json();
        setAlertHistory(data);
    } catch (err) {
        console.error('Failed to fetch alert history', err);
    }
};

const handleChannelToggle = (channel) => {
    setNewAlert(prev => ({
        ...prev,
        channels: prev.channels.includes(channel)
            ? prev.channels.filter(c => c !== channel)
            : [...prev.channels, channel]
    }));
};

const handleSendAlert = async () => {
    if (!newAlert.message || !newAlert.region || newAlert.channels.length === 0) {
        toast.error('Please fill all fields and select at least one channel');
        return;
    }

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${backendUrl}/api/alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAlert)
        });

        const data = await res.json();

        if (data.success) {
            toast.success('Alert dispatched successfully!');
            setNewAlert({ type: 'warning', message: '', region: '', channels: [] });
            fetchAlertHistory();
        }
    } catch (err) {
        toast.error('Failed to send alert');
        console.error(err);
    }
};

const getSeverityColor = (type) => {
    const colors = {
        critical: 'var(--accent-danger)',
        warning: 'var(--accent-warning)',
        info: 'var(--accent-primary)',
        success: 'var(--accent-success)'
    };
    return colors[type] || 'var(--accent-primary)';
};

return (
    <div style={{ height: '100%', overflow: 'auto', padding: '0 0 20px' }}>
        {/* Create Alert Section */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={20} style={{ color: 'var(--accent-primary)' }} />
                Dispatch New Alert
            </h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Alert Type */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Alert Severity
                    </label>
                    <select
                        className="custom-select"
                        value={newAlert.type}
                        onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                    >
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="critical">Critical</option>
                        <option value="success">Success/All Clear</option>
                    </select>
                </div>

                {/* Message */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Alert Message
                    </label>
                    <textarea
                        className="custom-input"
                        rows={3}
                        placeholder="Enter alert message for citizens... (supports Hindi, English)"
                        value={newAlert.message}
                        onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                {/* Region */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Target Region
                    </label>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="e.g., Rishikesh, Uttarakhand"
                        value={newAlert.region}
                        onChange={(e) => setNewAlert({ ...newAlert, region: e.target.value })}
                    />
                </div>

                {/* Channels */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Alert Channels (select multiple)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                        {[
                            { id: 'SMS', icon: MessageCircle, label: 'SMS' },
                            { id: 'Voice', icon: Volume2, label: 'Voice Call' },
                            { id: 'Push', icon: Smartphone, label: 'Push Notification' },
                            { id: 'Radio', icon: Radio, label: 'FM Radio' }
                        ].map(channel => {
                            const Icon = channel.icon;
                            const isSelected = newAlert.channels.includes(channel.id);
                            return (
                                <button
                                    key={channel.id}
                                    onClick={() => handleChannelToggle(channel.id)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                        background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s ease',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <Icon size={18} />
                                    {channel.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Send Button */}
                <button
                    className="btn btn-danger"
                    onClick={handleSendAlert}
                    style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '1rem' }}
                >
                    <Bell size={20} />
                    Broadcast Alert to {newAlert.region || 'Selected Region'}
                </button>
            </div>
        </div>

        {/* Alert History */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} style={{ color: 'var(--accent-warning)' }} />
                Alert History ({alertHistory.length})
            </h3>

            {alertHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No alerts dispatched yet
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {alertHistory.slice().reverse().map((alert) => (
                        <div
                            key={alert.id}
                            className="glass-panel"
                            style={{
                                padding: '1rem',
                                borderLeft: `4px solid ${getSeverityColor(alert.type)}`,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                <div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        background: `${getSeverityColor(alert.type)}20`,
                                        color: getSeverityColor(alert.type),
                                        marginBottom: '0.5rem'
                                    }}>
                                        {alert.type}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {alert.timestamp ? format(new Date(alert.timestamp), 'PPpp') : 'Just now'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {(alert.channels || ['SMS', 'Push']).map(ch => (
                                        <span key={ch} className="badge badge-info">{ch}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                {alert.message}
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '1rem',
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--border-color)'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        Target Region
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                        {alert.region || alert.target || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        Messages Sent
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                        {alert.deliveryStats?.sent?.toLocaleString() || 'Pending'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        Delivery Rate
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-success)' }}>
                                        {alert.deliveryStats?.delivered
                                            ? `${((alert.deliveryStats.delivered / alert.deliveryStats.sent) * 100).toFixed(1)}%`
                                            : 'Processing...'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        Status
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <CheckCircle size={14} style={{ color: 'var(--accent-success)' }} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-success)' }}>
                                            {alert.status || 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
};

export default AlertManagement;
