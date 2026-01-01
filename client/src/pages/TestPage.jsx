import React from 'react';

function TestPage() {
    return (
        <div style={{
            background: '#0f172a',
            color: 'white',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>🚨 DisasterSync</h1>
            <h2 style={{ fontSize: '2rem', color: '#3b82f6' }}>System is WORKING!</h2>
            <p style={{ fontSize: '1.5rem', marginTop: '2rem' }}>If you see this, React is rendering correctly.</p>
            <div style={{ marginTop: '3rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}>
                <p>✅ Backend: http://localhost:3000</p>
                <p>✅ Frontend: http://localhost:5174</p>
                <p>✅ React Router: Working</p>
            </div>
        </div>
    );
}

export default TestPage;
