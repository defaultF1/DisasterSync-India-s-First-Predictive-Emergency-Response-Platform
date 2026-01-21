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

const MapComponent = ({ resources = [], disaster, earthquakes = [] }) => {
    // Auto-center logic:
    // 1. If disaster prediction exists, focus there.
    // 2. If recent earthquakes exist, focus on the strongest one.
    // 3. Default to India center or Delhi.

    let position = [22.5937, 78.9629]; // Center of India
    let zoomLevel = 5;

    if (disaster && disaster.coordinates) {
        position = disaster.coordinates;
        zoomLevel = 6;
    } else if (earthquakes && earthquakes.length > 0) {
        // Find strongest quake
        const strongest = earthquakes.reduce((prev, current) => (prev.magnitude > current.magnitude) ? prev : current);
        if (strongest.coordinates) {
            position = strongest.coordinates;
            zoomLevel = 5;
        }
    }

    return (
        <MapContainer
            center={position}
            zoom={zoomLevel}
            style={{ height: '100%', width: '100%', borderRadius: '16px', zIndex: 1 }}
        >
            {/* Dark themed map tiles */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
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

            {/* Region Labels */}
            <Marker position={[33.2, 75.5]} icon={L.divIcon({
                className: 'region-label',
                html: '<div style="color: #fbbf24; font-weight: bold; font-size: 14px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); width: 150px; text-align: center;">UT of Jammu & Kashmir</div>',
                iconSize: [150, 20],
                iconAnchor: [75, 10]
            })} />

            <Marker position={[34.5, 77.6]} icon={L.divIcon({
                className: 'region-label',
                html: '<div style="color: #fbbf24; font-weight: bold; font-size: 14px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); width: 150px; text-align: center;">UT of Ladakh</div>',
                iconSize: [150, 20],
                iconAnchor: [75, 10]
            })} />

            {/* Major Cities Markers */}
            {[
                { name: 'Srinagar', pos: [34.0837, 74.7973] },
                { name: 'Leh', pos: [34.1526, 77.5770] },
                { name: 'New Delhi', pos: [28.6139, 77.2090] },
                { name: 'Mumbai', pos: [19.0760, 72.8777] },
                { name: 'Chennai', pos: [13.0827, 80.2707] },
                { name: 'Kolkata', pos: [22.5726, 88.3639] },
                { name: 'Bengaluru', pos: [12.9716, 77.5946] }
            ].map((city, idx) => (
                <Marker
                    key={`city-${idx}`}
                    position={city.pos}
                    icon={L.divIcon({
                        className: 'city-marker',
                        html: `
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="width: 6px; height: 6px; background: white; border-radius: 50%; border: 1px solid #64748b;"></div>
                                <div style="color: #94a3b8; font-size: 10px; margin-top: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.9); white-space: nowrap;">${city.name}</div>
                            </div>
                        `,
                        iconSize: [100, 40],
                        iconAnchor: [50, 6]
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
