/**
 * API Configuration
 * 
 * This utility handles the backend URL detection.
 * It prioritizes the VITE_API_URL environment variable (set in Vercel/Netlify),
 * and falls back to localhost:3000 for local development.
 */

const getApiUrl = () => {
    // Check if we are in a production environment or if VITE_API_URL is set
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Default to local development
    return 'http://localhost:3000';
};

export const API_URL = getApiUrl();
// For WebSockets, we typically use the same URL but the client library handles the protocol switch (http -> ws)
// or we can explicitly replace it if needed.
export const WS_URL = API_URL.replace(/^http/, 'ws');

export default {
    API_URL,
    WS_URL
};
