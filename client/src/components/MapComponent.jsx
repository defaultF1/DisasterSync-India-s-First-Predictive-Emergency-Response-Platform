import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import indiaBoundary from '../data/india-boundary.json';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Remove old createCustomIcon function as we are now using inline divIcons in the render

// --- WAR ROOM VISUALS: Custom Icons & Pulse Animation ---

const getAgencyIcon = (type) => {
    let color = '#3b82f6'; // Default Blue
    let emoji = '🚛';

    if (type.includes('Ambulance')) {
        color = '#ef4444'; // Red
        emoji = '🚑';
    } else if (type.includes('Police')) {
        color = '#3b82f6'; // Blue
        emoji = '🚓';
    } else if (type.includes('NDRF')) {
        color = '#f97316'; // Orange
        emoji = '🧑‍🚒';
    } else if (type.includes('Helicopter')) {
        color = '#10b981'; // Green
        emoji = '🚁';
    }

    return L.divIcon({
        className: 'custom-agency-icon',
        html: `<div style="
                background-color: ${color};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                font-size: 16px;
                transition: all 0.3s ease;
            ">${emoji}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

const disasterIcon = L.divIcon({
    className: 'pulse-marker', // Pulse animation container
    html: '<div class="pulse"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const earthquakeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper to auto-center map when props change
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    L.Icon.Default.prototype._getIconUrl = null; // Ensure this runs once

    React.useEffect(() => {
        map.flyTo(center, zoom, {
            duration: 2 // smooth animation duration 2 seconds
        });
    }, [center, zoom, map]);

    return null;
};

const MapComponent = ({ resources = [], disaster, earthquakes = [] }) => {
    // Map ALWAYS centers on India by default.
    // Only move if there's an active disaster prediction with coordinates within India.

    let position = [22.5937, 78.9629]; // Center of India
    let zoomLevel = 5;

    // Only fly to disaster if it's in India (approximate bounding box check)
    if (disaster && disaster.coordinates) {
        const [lat, lng] = disaster.coordinates;
        const isInIndia = lat >= 6 && lat <= 37 && lng >= 68 && lng <= 98;
        if (isInIndia) {
            position = disaster.coordinates;
            zoomLevel = 7;
        }
    }
    // Note: We do NOT auto-center on USGS earthquakes as they are mostly outside India.

    return (
        <MapContainer
            center={position}
            zoom={zoomLevel}
            minZoom={3} // Prevent zooming out to see infinite worlds
            maxBounds={[[-90, -180], [90, 180]]} // Restrict view to the world
            maxBoundsViscosity={1.0} // Hard stop at bounds
            style={{ height: '100%', width: '100%', borderRadius: '16px', zIndex: 1, background: '#000000' }} // Dark background to hide tile gaps
        >
            <ChangeView center={position} zoom={zoomLevel} />
            {/* Dark themed map tiles */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                noWrap={true} // Prevent tile repetition
            />

            {/* Official India Boundary Overlay */}
            <GeoJSON
                data={indiaBoundary}
                style={{
                    color: '#ff9933',
                    weight: 2,
                    fillColor: '#ff9933',
                    fillOpacity: 0.05,
                    dashArray: ''
                }}
                interactive={false}
            />

            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .pulse-icon {
                    animation: pulse-ring 2s infinite;
                }
            `}</style>

            {/* Region Labels REMOVED for cleaner look */}

            {/* Major Cities - Simplified Dots */}
            {[
                { name: 'New Delhi', pos: [28.6139, 77.2090] },
                { name: 'Mumbai', pos: [19.0760, 72.8777] },
                { name: 'Bengaluru', pos: [12.9716, 77.5946] }
            ].map((city, idx) => (
                <Marker
                    key={`city-${idx}`}
                    position={city.pos}
                    icon={L.divIcon({
                        className: 'city-dot',
                        html: `<div style="width: 8px; height: 8px; background: rgba(255,255,255,0.5); border-radius: 50%;"></div>`,
                        iconSize: [10, 10],
                        iconAnchor: [5, 5]
                    })}
                />
            ))}

            {/* Real Earthquake Markers */}
            {earthquakes.map((quake) => (
                <React.Fragment key={quake.id}>
                    {/* Ripple Effect Circle */}
                    <Circle
                        center={quake.coordinates}
                        pathOptions={{
                            color: '#fbbf24',
                            fillColor: '#fbbf24',
                            fillOpacity: 0.2,
                            weight: 1,
                        }}
                        radius={15000 * (quake.magnitude / 3)} // Radius scales with magnitude
                    />
                    {/* Core Danger Circle */}
                    <Circle
                        center={quake.coordinates}
                        pathOptions={{
                            color: '#dc2626',
                            fillColor: '#ef4444',
                            fillOpacity: 0.6,
                            weight: 2
                        }}
                        radius={2000 * quake.magnitude}
                    >
                        <Popup className="custom-popup">
                            <div style={{ padding: '8px', minWidth: '180px' }}>
                                <h3 style={{
                                    color: '#ef4444',
                                    margin: '0 0 8px 0',
                                    fontSize: '1rem',
                                    fontWeight: '700'
                                }}>
                                    🌋 Earthquake detected
                                </h3>
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Magnitude:</strong> <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{quake.magnitude.toFixed(1)}</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Region:</strong> {quake.region}
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Time:</strong> {new Date(quake.time).toLocaleTimeString()}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                                    Source: USGS Real-time Feed
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                </React.Fragment>
            ))}

            {/* Original Disaster Prediction Visualization (if exists) */}
            {disaster && disaster.coordinates && (
                <>
                    {/* PULSING RADAR EFFECT */}
                    <Marker
                        position={disaster.coordinates}
                        icon={L.divIcon({
                            className: 'leaflet-pulse-marker', // Empty or standard class to avoid style conflict
                            html: '<div class="pulse-icon" style="width: 100%; height: 100%; border-radius: 50%; background: rgba(239, 68, 68, 0.4);"></div>',
                            iconSize: [40, 40],
                            iconAnchor: [20, 20]
                        })}
                    />

                    <Circle
                        center={disaster.coordinates}
                        pathOptions={{
                            color: '#ef4444',
                            fillColor: '#ef4444',
                            fillOpacity: 0.15,
                            weight: 2,
                            dashArray: '10, 5'
                        }}
                        radius={disaster.radius || 15000}
                    />

                    <Circle
                        center={disaster.coordinates}
                        pathOptions={{
                            color: '#dc2626',
                            fillColor: '#ef4444',
                            fillOpacity: 0.3,
                            weight: 3
                        }}
                        radius={(disaster.radius || 15000) / 2}
                    >
                        <Popup className="custom-popup">
                            <div style={{ padding: '8px', minWidth: '200px' }}>
                                <h3 style={{
                                    color: '#ef4444',
                                    margin: '0 0 8px 0',
                                    fontSize: '1.1rem',
                                    fontWeight: '700'
                                }}>
                                    ⚠️ {disaster.severity} Alert: {disaster.type}
                                </h3>
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Region:</strong> {disaster.region}
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Impact:</strong> {disaster.impactEstimate}
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Time:</strong> {disaster.predictedTime}
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                </>
            )}

            {/* Resource Markers */}
            {resources.map(res => (
                <Marker
                    key={res.id}
                    position={[res.lat, res.lng]}
                    icon={getAgencyIcon(res.type)}
                >
                    <Popup className="custom-popup">
                        <div style={{ padding: '4px', minWidth: '180px' }}>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: '700',
                                marginBottom: '6px',
                                color: '#f8fafc'
                            }}>
                                {res.type}
                            </div>
                            <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                                <strong>Status:</strong> {res.status}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
