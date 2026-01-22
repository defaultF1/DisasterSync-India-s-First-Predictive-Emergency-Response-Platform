/**
 * Real Data Service - Fetches data from OpenWeatherMap + Open-Meteo + USGS
 * Phase 1: Live AI Engine with Heuristic Risk Scoring
 */

const axios = require('axios');

// API Endpoints
const OPENWEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';
const OPEN_METEO_WEATHER = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_FLOOD = 'https://flood-api.open-meteo.com/v1/flood';
const USGS_EARTHQUAKE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

// OpenWeatherMap API Key (Free Tier - 60 calls/min)
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

// 5 High-Risk Indian Cities for Demo (as per hackathon requirements)
const HIGH_RISK_CITIES = {
    mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra', riskType: 'Flood/Cyclone' },
    chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu', riskType: 'Cyclone/Flood' },
    guwahati: { lat: 26.1445, lng: 91.7362, name: 'Guwahati, Assam', riskType: 'Flood' },
    kedarnath: { lat: 30.7346, lng: 79.0669, name: 'Kedarnath, Uttarakhand', riskType: 'Flash Flood/Landslide' },
    cuttack: { lat: 20.4625, lng: 85.8830, name: 'Cuttack, Odisha', riskType: 'Cyclone/Flood' }
};

// Extended regions including original + high-risk cities
const INDIA_REGIONS = {
    ...HIGH_RISK_CITIES,
    delhi: { lat: 28.61, lng: 77.20, name: 'Delhi', riskType: 'Heat/Pollution' },
    kolkata: { lat: 22.57, lng: 88.36, name: 'Kolkata', riskType: 'Flood' },
    rishikesh: { lat: 30.08, lng: 78.26, name: 'Rishikesh', riskType: 'Flash Flood' },
    shimla: { lat: 31.10, lng: 77.17, name: 'Shimla', riskType: 'Landslide' }
};

// Risk threshold for triggering predictions
const RISK_THRESHOLD = 60;

/**
 * Fetch weather from OpenWeatherMap (Primary - Live Data)
 */
const fetchOpenWeather = async (lat, lng) => {
    if (!OPENWEATHER_API_KEY) {
        return { success: false, error: 'OpenWeather API key not configured' };
    }

    try {
        const response = await axios.get(OPENWEATHER_API, {
            params: {
                lat,
                lon: lng,
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });

        const data = response.data;
        return {
            success: true,
            source: 'OpenWeatherMap',
            current: {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
                rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
                weatherCode: data.weather[0]?.id || 0,
                description: data.weather[0]?.description || 'Unknown',
                pressure: data.main.pressure,
                visibility: data.visibility / 1000,
                clouds: data.clouds?.all || 0
            },
            city: data.name,
            timestamp: new Date()
        };
    } catch (error) {
        console.error('OpenWeather API error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch real weather data from Open-Meteo (Fallback - No API Key needed)
 */
const fetchWeather = async (lat = 28.61, lng = 77.20) => {
    // Try OpenWeatherMap first
    const openWeatherResult = await fetchOpenWeather(lat, lng);
    if (openWeatherResult.success) {
        return openWeatherResult;
    }

    // Fallback to Open-Meteo
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
            source: 'Open-Meteo',
            current: {
                temperature: data.hourly.temperature_2m[currentHour],
                humidity: data.hourly.relative_humidity_2m[currentHour],
                precipitation: data.hourly.precipitation[currentHour],
                rainfall: data.hourly.precipitation[currentHour],
                windSpeed: data.hourly.wind_speed_10m[currentHour],
                weatherCode: data.hourly.weather_code[currentHour]
            },
            daily: data.daily,
            hourly: data.hourly,
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

        // Filter for South Asia region
        const southAsiaQuakes = earthquakes.filter(eq => {
            const [lng, lat] = eq.coordinates;
            return lat >= 5 && lat <= 40 && lng >= 60 && lng <= 100;
        });

        return {
            success: true,
            total: earthquakes.length,
            southAsia: southAsiaQuakes,
            all: earthquakes.slice(0, 20),
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
 * HEURISTIC RISK SCORING ALGORITHM
 * Risk = (Wind Speed * 0.4) + (Humidity * 0.2) + (Rainfall Probability * 0.4)
 * Normalized to 0-100 scale
 * 
 * @param {Object} weatherData - Current weather data
 * @param {boolean} forceDisaster - "Demo Cheat Code" - adds +50 to wind speed
 * @returns {number} Risk score 0-100
 */
const calculateHeuristicRisk = (weatherData, forceDisaster = false) => {
    if (!weatherData || !weatherData.current) return 0;

    const current = weatherData.current;

    // Get values (handle both OpenWeather and Open-Meteo formats)
    let windSpeed = current.windSpeed || 0; // km/h
    let humidity = current.humidity || 0; // percentage (0-100)
    let rainfall = current.rainfall || current.precipitation || 0; // mm

    // "Force Disaster" demo cheat - adds +50 km/h to wind speed
    if (forceDisaster) {
        windSpeed += 50;
        console.log('🚨 FORCE DISASTER MODE: Wind speed boosted by +50 km/h');
    }

    // Normalize values to 0-100 scale for calculation
    // Wind: 0-100 km/h maps to 0-100
    const normalizedWind = Math.min(100, windSpeed);

    // Humidity already 0-100
    const normalizedHumidity = humidity;

    // Rainfall: 0-50mm maps to 0-100 (anything over 50mm is max risk)
    const normalizedRainfall = Math.min(100, rainfall * 2);

    // Apply heuristic formula
    const riskScore = (normalizedWind * 0.4) + (normalizedHumidity * 0.2) + (normalizedRainfall * 0.4);

    return Math.round(Math.min(100, riskScore));
};

/**
 * Calculate disaster risk score for a region
 * Now with heuristic formula and auto-prediction trigger
 */
const calculateRiskScore = async (region = 'delhi', forceDisaster = false) => {
    const coords = INDIA_REGIONS[region] || INDIA_REGIONS.delhi;

    const weather = await fetchWeather(coords.lat, coords.lng);
    const earthquakes = await fetchEarthquakes('2.5', 'day');

    // Calculate heuristic risk score
    let riskScore = 0;
    let riskFactors = [];

    if (weather.success) {
        riskScore = calculateHeuristicRisk(weather, forceDisaster);

        // Add risk factors explanation
        const current = weather.current;
        let windSpeed = current.windSpeed || 0;
        if (forceDisaster) windSpeed += 50;

        if (windSpeed > 40) riskFactors.push(`High wind: ${windSpeed.toFixed(1)} km/h`);
        if ((current.humidity || 0) > 70) riskFactors.push(`High humidity: ${current.humidity}%`);
        if ((current.rainfall || current.precipitation || 0) > 10) {
            riskFactors.push(`Heavy rainfall: ${(current.rainfall || current.precipitation).toFixed(1)}mm`);
        }
        if (current.weatherCode >= 95) riskFactors.push('Storm conditions detected');
    }

    // Add earthquake risk
    if (earthquakes.success && earthquakes.southAsia.length > 0) {
        const maxMag = Math.max(...earthquakes.southAsia.map(eq => eq.magnitude));
        if (maxMag >= 4.0) {
            riskScore = Math.min(100, riskScore + 20);
            riskFactors.push(`Recent earthquake M${maxMag} nearby`);
        }
    }

    // Determine risk level
    let level;
    if (riskScore >= 70) level = 'Critical';
    else if (riskScore >= 50) level = 'High';
    else if (riskScore >= 30) level = 'Moderate';
    else level = 'Low';

    // Should trigger prediction alert?
    const shouldTriggerAlert = riskScore >= RISK_THRESHOLD;

    return {
        region: coords.name,
        regionKey: region,
        riskType: coords.riskType,
        score: riskScore,
        level,
        factors: riskFactors,
        weather: weather.success ? weather.current : null,
        weatherSource: weather.source || 'Unknown',
        earthquakes: earthquakes.success ? earthquakes.southAsia.length : 0,
        shouldTriggerAlert,
        forceDisasterMode: forceDisaster,
        coordinates: { lat: coords.lat, lng: coords.lng },
        timestamp: new Date()
    };
};

/**
 * Fetch weather for all 5 high-risk cities
 * Used for dashboard overview
 */
const fetchAllHighRiskCities = async (forceDisaster = false) => {
    const results = [];

    for (const [key, city] of Object.entries(HIGH_RISK_CITIES)) {
        const riskData = await calculateRiskScore(key, forceDisaster);
        results.push(riskData);
    }

    // Sort by risk score (highest first)
    results.sort((a, b) => b.score - a.score);

    return {
        success: true,
        cities: results,
        highestRisk: results[0],
        alertsTriggered: results.filter(r => r.shouldTriggerAlert).length,
        timestamp: new Date()
    };
};

module.exports = {
    fetchWeather,
    fetchOpenWeather,
    fetchFloodData,
    fetchEarthquakes,
    getWeatherDescription,
    calculateRiskScore,
    calculateHeuristicRisk,
    fetchAllHighRiskCities,
    INDIA_REGIONS,
    HIGH_RISK_CITIES,
    RISK_THRESHOLD
};
