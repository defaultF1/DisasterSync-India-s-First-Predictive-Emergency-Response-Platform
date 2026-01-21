import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { API_URL } from '../utils/apiConfig';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(true); // DEMO: Always show as connected

    // MOCK DATA FOR PRESENTATION
    const [predictions, setPredictions] = useState([
        {
            id: 1,
            type: 'Cyclone',
            severity: 'Critical',
            region: 'Odisha Coast',
            predictedTime: '2 Hours',
            confidence: 94,
            impactEstimate: '1.2M People Affected',
            radius: 150000,
            aiModel: 'CycloneNet-V4',
            evacuationZones: [
                { name: 'Zone A', priority: 'High', population: 50000 },
                { name: 'Zone B', priority: 'High', population: 35000 }
            ]
        },
        {
            id: 2,
            type: 'Flood',
            severity: 'High',
            region: 'Kerala Lowlands',
            predictedTime: '5 Hours',
            confidence: 78,
            impactEstimate: '500K People',
            radius: 80000,
            aiModel: 'HydroAI-2.0',
            evacuationZones: []
        }
    ]);

    const [resources, setResources] = useState([
        { id: 'NDRF-01', type: 'Rescue Helicopter', status: 'Available', fuel: 'Full', lat: 20.2961, lng: 85.8245, team: 'NDRF Alpha' },
        { id: 'AMB-108', type: 'Ambulance', status: 'Busy', fuel: 'Medium', lat: 20.35, lng: 85.80, team: 'Apollo Emergency' },
        { id: 'BOAT-22', type: 'Rescue Boat', status: 'Available', fuel: 'Full', lat: 20.25, lng: 85.85, team: 'Coast Guard' },
        { id: 'TRK-99', type: 'Supply Truck', status: 'In Transit', fuel: 'Low', lat: 20.30, lng: 85.75, team: 'Red Cross' },
        { id: 'SHELTER-A', type: 'Shelter', status: 'Open', capacity: 500, occupancy: 124, lat: 20.32, lng: 85.88, team: 'Govt School' }
    ]);

    const [agencies, setAgencies] = useState([
        { id: 1, name: 'NDRF', status: 'Active' },
        { id: 2, name: 'Fire Dept', status: 'Active' },
        { id: 3, name: 'Police', status: 'Busy' }
    ]);

    const [feed, setFeed] = useState([
        { id: 1, message: 'Cyclone warning issued for coastal districts.', type: 'alert', time: 'Now' },
        { id: 2, message: 'NDRF Team Alpha deployed to Sector 4.', type: 'info', time: '2m ago' },
        { id: 3, message: 'Shelter A-12 reached 50% capacity.', type: 'warning', time: '5m ago' },
        { id: 4, message: 'Weather update: Wind speeds reducing slightly.', type: 'info', time: '10m ago' },
        { id: 5, message: 'Power grid restoration successful in Zone B.', type: 'success', time: '15m ago' }
    ]);

    useEffect(() => {
        const backendUrl = API_URL;
        const newSocket = io(backendUrl);

        newSocket.on('connect', () => {
            console.log('✅ WebSocket connected');
            setIsConnected(true);
            // DEMO: Suppress connection toast
        });

        newSocket.on('disconnect', () => {
            console.log('❌ WebSocket disconnected');
            // DEMO: Don't change isConnected to false, keep UI showing "Live"
            // DEMO: Suppress disconnect warning toast
        });

        newSocket.on('predictions', (data) => {
            setPredictions(data);
        });

        newSocket.on('resources', (data) => {
            setResources(data);
        });

        newSocket.on('agencies', (data) => {
            setAgencies(data);
        });

        newSocket.on('new-alert', (alert) => {
            toast.info(`🚨 Alert dispatched: ${alert.message}`, {
                position: 'top-right',
                autoClose: 4000
            });
        });

        newSocket.on('citizen-report', (report) => {
            toast.info(`📱 New citizen report from ${report.location}`, {
                position: 'top-right'
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const value = {
        socket,
        isConnected,
        predictions,
        resources,
        agencies,
        feed
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
