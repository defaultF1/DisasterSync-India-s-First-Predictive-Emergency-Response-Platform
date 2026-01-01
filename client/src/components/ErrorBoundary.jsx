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
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#1e293b', color: '#fff', height: '100vh', fontFamily: 'sans-serif' }}>
          <h1>🛑 Application Crashed</h1>
          <p>The following error occurred:</p>
          <h3 style={{ color: '#ef4444', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            {this.state.error && this.state.error.toString()}
          </h3>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Component Stack Trace</summary>
            <pre style={{ background: '#0f172a', padding: '1rem', overflow: 'auto', borderRadius: '8px', fontSize: '0.85rem' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              marginTop: '20px',
              cursor: 'pointer',
              background: '#3b82f6',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
