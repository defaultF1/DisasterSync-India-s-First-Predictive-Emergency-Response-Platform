import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [resources, setResources] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [isConnected, setIsConnected] = useState(true);
    const [simulationTrigger, setSimulationTrigger] = useState(0);

    useEffect(() => {
        // Listen to resources in real-time from Firestore
        const unsubResources = onSnapshot(
            collection(db, 'resources'),
            (snapshot) => {
                const resourceData = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setResources(resourceData);
                setIsConnected(true);
            },
            (error) => {
                console.error('Resources listener error:', error);
                setIsConnected(false);
                // Fallback to mock data if Firebase fails
                setResources(getMockResources());
            }
        );

        // Listen to predictions in real-time
        const unsubPredictions = onSnapshot(
            query(collection(db, 'predictions'), orderBy('timestamp', 'desc'), limit(1)),
            (snapshot) => {
                const predData = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setPredictions(predData);
            },
            (error) => {
                console.error('Predictions listener error:', error);
                // Silently fail for predictions
            }
        );

        return () => {
            unsubResources();
            unsubPredictions();
        };
    }, []);

    const triggerSimulation = () => {
        setSimulationTrigger(prev => prev + 1);
    };

    return (
        <FirebaseContext.Provider value={{
            resources,
            predictions,
            isConnected,
            setPredictions,
            simulationTrigger,
            triggerSimulation
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};

// Mock data fallback
function getMockResources() {
    return [
        { id: 'BOAT-101', type: 'Rescue Boat', status: 'Available', lat: 20.2961, lng: 85.8245, fuel: 'Full', team: 'Coast Guard' },
        { id: 'HELI-201', type: 'Rescue Helicopter', status: 'Available', lat: 28.6139, lng: 77.2090, fuel: 'Full', team: 'NDRF Alpha' },
        { id: 'AMB-105', type: 'Ambulance', status: 'Busy', lat: 20.3500, lng: 85.8000, fuel: 'Medium', team: 'Apollo Emergency' },
        { id: 'TRK-99', type: 'Supply Truck', status: 'In Transit', lat: 30.0869, lng: 78.2676, fuel: 'Full', team: 'State Relief' },
        { id: 'SHELTER-A', type: 'Shelter', status: 'Open', lat: 28.7041, lng: 77.1025, capacity: 500, occupancy: 234 }
    ];
}

// For backward compatibility - export as useWebSocket too
export const useWebSocket = useFirebase;
export const WebSocketProvider = FirebaseProvider;
