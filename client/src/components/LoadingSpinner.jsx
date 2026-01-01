import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '2rem',
            minHeight: '200px'
        }}>
            <Loader2
                size={size}
                className="animate-spin"
                style={{ color: 'var(--accent-primary)' }}
            />
            {message && (
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
