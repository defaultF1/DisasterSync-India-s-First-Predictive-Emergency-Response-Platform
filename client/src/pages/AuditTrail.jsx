import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, RefreshCw, Database, Link, Clock } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AuditTrail = () => {
    const [chain, setChain] = useState([]);
    const [stats, setStats] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [chainRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/api/blockchain`),
                axios.get(`${API_URL}/api/blockchain/stats`)
            ]);
            setChain(chainRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch blockchain data:', error);
        }
        setLoading(false);
    };

    const verifyChain = async () => {
        setVerifying(true);
        try {
            const res = await axios.get(`${API_URL}/api/blockchain/verify`);
            setVerificationResult(res.data);
        } catch (error) {
            setVerificationResult({ valid: false, error: 'Verification request failed' });
        }
        setVerifying(false);
    };

    const formatHash = (hash) => {
        if (!hash) return 'N/A';
        return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Database size={32} color="var(--accent-primary)" />
                        Audit Trail
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Immutable audit trail for all DisasterSync operations
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn" onClick={fetchData} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                    <button className="btn btn-primary" onClick={verifyChain} disabled={verifying}>
                        <Shield size={18} /> {verifying ? 'Verifying...' : 'Verify Integrity'}
                    </button>
                </div>
            </div>

            {/* Verification Result */}
            {verificationResult && (
                <div className="glass-panel" style={{
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    borderLeft: `4px solid ${verificationResult.valid ? 'var(--accent-success)' : 'var(--accent-danger)'}`
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {verificationResult.valid ? (
                            <CheckCircle size={24} color="var(--accent-success)" />
                        ) : (
                            <XCircle size={24} color="var(--accent-danger)" />
                        )}
                        <div>
                            <h3 style={{ marginBottom: '4px' }}>
                                {verificationResult.valid ? 'Chain Integrity Verified' : 'Chain Integrity FAILED'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {verificationResult.message || verificationResult.error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{stats.totalBlocks}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Total Blocks</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-secondary)' }}>{stats.latestBlock}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Latest Hash</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{formatTime(stats.genesisTime)}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Genesis Block</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{formatTime(stats.lastActivity)}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Last Activity</div>
                    </div>
                </div>
            )}

            {/* Chain */}
            <h2 style={{ marginBottom: '1rem' }}>Block History</h2>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading blockchain...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {chain.slice().reverse().map((block, idx) => (
                        <div key={block.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: block.type === 'GENESIS' ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        #{block.index}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{block.type}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <Clock size={12} style={{ marginRight: '4px' }} />
                                            {formatTime(block.timestamp)}
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge ${block.type === 'GENESIS' ? 'badge-info' : 'badge-success'}`}>
                                    {block.type === 'GENESIS' ? 'Genesis' : 'Confirmed'}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Hash</div>
                                    <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                        {formatHash(block.hash)}
                                    </code>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        <Link size={12} style={{ marginRight: '4px' }} />
                                        Previous Hash
                                    </div>
                                    <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                        {formatHash(block.previousHash)}
                                    </code>
                                </div>
                            </div>

                            {block.data && block.type !== 'GENESIS' && (
                                <details style={{ marginTop: '1rem' }}>
                                    <summary style={{ cursor: 'pointer', color: 'var(--accent-primary)' }}>View Data</summary>
                                    <pre style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem',
                                        overflow: 'auto',
                                        fontSize: '0.8rem'
                                    }}>
                                        {JSON.stringify(block.data, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuditTrail;
