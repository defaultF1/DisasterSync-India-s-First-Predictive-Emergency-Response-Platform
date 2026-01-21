/**
 * Real Data Service - Fetches data from free public APIs
 * Open-Meteo (Weather/Floods) + USGS (Earthquakes)
 */

const axios = require('axios');

// API Endpoints (No keys required)
const OPEN_METEO_WEATHER = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_FLOOD = 'https://flood-api.open-meteo.com/v1/flood';
const USGS_EARTHQUAKE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

// Indian region coordinates for default queries
const INDIA_REGIONS = {
    delhi: { lat: 28.61, lng: 77.20, name: 'Delhi' },
    mumbai: { lat: 19.07, lng: 72.87, name: 'Mumbai' },
    chennai: { lat: 13.08, lng: 80.27, name: 'Chennai' },
    kolkata: { lat: 22.57, lng: 88.36, name: 'Kolkata' },
    rishikesh: { lat: 30.08, lng: 78.26, name: 'Rishikesh' },
    shimla: { lat: 31.10, lng: 77.17, name: 'Shimla' }
};

/**
 * Fetch real weather data from Open-Meteo
 */
const fetchWeather = async (lat = 28.61, lng = 77.20) => {
    try {
        const response = await axios.get(OPEN_METEO_WEATHER, {
            params: {
                latitude: lat,
                longitude: lng,
                hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
                timezone: 'Asia/Kolkata',
                forecast_days: 3
            }
        });

        const data = response.data;
        const currentHour = new Date().getHours();

        return {
            success: true,
            current: {
                temperature: data.hourly.temperature_2m[currentHour],
                humidity: data.hourly.relative_humidity_2m[currentHour],
                precipitation: data.hourly.precipitation[currentHour],
                windSpeed: data.hourly.wind_speed_10m[currentHour],
                weatherCode: data.hourly.weather_code[currentHour]
            },
            daily: data.daily,
            hourly: data.hourly,
            source: 'Open-Meteo',
            timestamp: new Date()
        };
    } catch (error) {
        console.error('Weather API error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch flood/river discharge data from Open-Meteo
 */
const fetchFloodData = async (lat = 30.08, lng = 78.26) => {
    try {
        const response = await axios.get(OPEN_METEO_FLOOD, {
            params: {
                latitude: lat,
                longitude: lng,
                daily: 'river_discharge,river_discharge_mean,river_discharge_max',
                forecast_days: 7
            }
        });

        return {
            success: true,
            data: response.data,
            source: 'Open-Meteo Flood API',
            timestamp: new Date()
        };
    } catch (error) {
        console.error('Flood API error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch real earthquake data from USGS
 */
const fetchEarthquakes = async (magnitude = '2.5', period = 'day') => {
    try {
        // Options: all_hour, all_day, all_week, all_month
        // Magnitude: significant, 4.5, 2.5, 1.0, all
        const response = await axios.get(`${USGS_EARTHQUAKE}/${magnitude}_${period}.geojson`);

        const earthquakes = response.data.features.map(eq => ({
            id: eq.id,
            magnitude: eq.properties.mag,
            place: eq.properties.place,
            time: new Date(eq.properties.time),
            coordinates: eq.geometry.coordinates,
            depth: eq.geometry.coordinates[2],
            url: eq.properties.url,
            felt: eq.properties.felt,
            tsunami: eq.properties.tsunami,
            type: eq.properties.type
        }));

        // Filter for South Asia region (rough bounding box)
        const southAsiaQuakes = earthquakes.filter(eq => {
            const [lng, lat] = eq.coordinates;
            return lat >= 5 && lat <= 40 && lng >= 60 && lng <= 100;
        });

        return {
            success: true,
            total: earthquakes.length,
            southAsia: southAsiaQuakes,
            all: earthquakes.slice(0, 20), // Limit to 20 for performance
            source: 'USGS',
            timestamp: new Date()
        };
    } catch (error) {
        console.error('USGS API error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get weather condition description from weather code
 */
const getWeatherDescription = (code) => {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Severe thunderstorm'
    };
    return descriptions[code] || 'Unknown';
};

/**
 * Calculate disaster risk score based on real data
 */
const calculateRiskScore = async (region = 'delhi') => {
    const coords = INDIA_REGIONS[region] || INDIA_REGIONS.delhi;

    const weather = await fetchWeather(coords.lat, coords.lng);
    const earthquakes = await fetchEarthquakes('2.5', 'day');

    let riskScore = 0;
    let riskFactors = [];

    if (weather.success) {
        // Heavy precipitation risk
        if (weather.current.precipitation > 10) {
            riskScore += 30;
            riskFactors.push('Heavy precipitation detected');
        }
        // High wind risk
        if (weather.current.windSpeed > 40) {
            riskScore += 20;
            riskFactors.push('High wind speeds');
        }
        // Storm risk
        if (weather.current.weatherCode >= 95) {
            riskScore += 40;
            riskFactors.push('Storm/Thunderstorm conditions');
        }
    }

    if (earthquakes.success && earthquakes.southAsia.length > 0) {
        const maxMag = Math.max(...earthquakes.southAsia.map(eq => eq.magnitude));
        if (maxMag >= 4.0) {
            riskScore += 30;
            riskFactors.push(`Recent earthquake M${maxMag} in region`);
        }
    }

    return {
        region: coords.name,
        score: Math.min(riskScore, 100),
        level: riskScore >= 70 ? 'Critical' : riskScore >= 40 ? 'High' : riskScore >= 20 ? 'Moderate' : 'Low',
        factors: riskFactors,
        weather: weather.success ? weather.current : null,
        earthquakes: earthquakes.success ? earthquakes.southAsia.length : 0,
        timestamp: new Date()
    };
};

module.exports = {
    fetchWeather,
    fetchFloodData,
    fetchEarthquakes,
    getWeatherDescription,
    calculateRiskScore,
    INDIA_REGIONS
};
