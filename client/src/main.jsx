import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

// Suppress error overlay in production
if (!import.meta.env.DEV) {
    // Handle unhandled errors
    window.addEventListener('error', (event) => {
        event.preventDefault();
        console.error('Global error caught:', event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        event.preventDefault();
        console.error('Unhandled promise rejection:', event.reason);
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
