import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon creator based on resource type
const createCustomIcon = (type, status) => {
    const colors = {
        'Available': '#10b981',
        'Busy': '#f59e0b',
        'In Transit': '#3b82f6',
        'Refueling': '#f59e0b',
        'Open': '#10b981'
    };

    const icons = {
        'Rescue Boat': '🚤',
        'Rescue Helicopter': '🚁',
        'Ambulance': '🚑',
        'Supply Truck': '🚚',
        'Shelter': '🏠'
    };

    const color = colors[status] || '#94a3b8';
    const emoji = icons[type] || '📍';

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

const MapComponent = ({ resources = [], disaster }) => {
    // Auto-center on disaster if available, otherwise Rishikesh
    const position = disaster && disaster.coordinates
        ? disaster.coordinates
        : [30.0869, 78.2676];

    return (
        <MapContainer
            center={position}
            zoom={12}
            style={{ height: '100%', width: '100%', borderRadius: '16px', zIndex: 1 }}
        >
            {/* Dark themed map tiles */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Disaster Zone Visualization */}
            {disaster && disaster.coordinates && (
                <>
                    {/* Outer warning circle */}
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

                    {/* Inner danger zone */}
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
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Confidence:</strong> <span style={{ color: '#10b981' }}>{disaster.confidence}%</span>
                                </div>
                                {disaster.aiModel && (
                                    <div style={{
                                        marginTop: '8px',
                                        padding: '4px 8px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        color: '#3b82f6'
                                    }}>
                                        AI Model: {disaster.aiModel}
                                    </div>
                                )}
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
                    icon={createCustomIcon(res.type, res.status)}
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

                            {res.team && (
                                <div style={{ fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1' }}>
                                    <strong>Team:</strong> {res.team}
                                </div>
                            )}

                            <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                                <strong>Status:</strong> <span style={{
                                    color: res.status === 'Available' ? '#10b981' :
                                        res.status === 'Busy' || res.status === 'In Transit' ? '#f59e0b' : '#94a3b8',
                                    fontWeight: '600'
                                }}>
                                    {res.status}
                                </span>
                            </div>

                            {res.fuel && (
                                <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                                    <strong>Fuel:</strong> <span style={{
                                        color: res.fuel === 'Full' ? '#10b981' :
                                            res.fuel === 'Medium' ? '#f59e0b' : '#ef4444'
                                    }}>
                                        {res.fuel}
                                    </span>
                                </div>
                            )}

                            {res.capacity !== undefined && (
                                <div style={{ fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1' }}>
                                    <strong>Capacity:</strong> {res.occupancy !== undefined ? `${res.occupancy}/${res.capacity}` : res.capacity}
                                </div>
                            )}

                            <div style={{
                                fontSize: '0.75rem',
                                marginTop: '6px',
                                padding: '4px 6px',
                                background: 'rgba(59, 130, 246, 0.15)',
                                borderRadius: '4px',
                                color: '#3b82f6'
                            }}>
                                📍 {res.lat.toFixed(4)}, {res.lng.toFixed(4)}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
