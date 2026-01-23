import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Only log errors in development
    if (import.meta.env.DEV) {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // In production, show a clean error page instead of the red overlay
      return (
        <div style={{
          padding: '2rem',
          background: '#0f172a',
          color: '#fff',
          minHeight: '100vh',
          fontFamily: 'sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</h1>
            <h2 style={{ marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && (
              <>
                <div style={{
                  color: '#ef4444',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  textAlign: 'left'
                }}>
                  {this.state.error && this.state.error.toString()}
                </div>
                <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                  <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Stack Trace</summary>
                  <pre style={{
                    background: '#000',
                    padding: '1rem',
                    overflow: 'auto',
                    borderRadius: '8px',
                    fontSize: '0.75rem'
                  }}>
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 32px',
                marginTop: '2rem',
                cursor: 'pointer',
                background: '#3b82f6',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
