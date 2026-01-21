const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db'); // DB Config

// Auth Module
const {
  ROLES,
  registerUser,
  loginUser,
  authMiddleware,
  requireRole,
  getAllUsers,
  seedDefaultUsers
} = require('./auth');

// Real Data Service - Open-Meteo & USGS APIs
const {
  fetchWeather,
  fetchFloodData,
  fetchEarthquakes,
  getWeatherDescription,
  calculateRiskScore,
  INDIA_REGIONS
} = require('./realDataService');

const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Security Middleware - Helmet for HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting - Protect against DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Production-ready CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// --- Enhanced Mock Data ---

let DISASTER_PREDICTIONS = [
  {
    id: 'pred_1',
    type: 'Flash Flood',
    region: 'Rishikesh, Uttarakhand',
    severity: 'Critical',
    confidence: 87,
    predictedTime: '2 hrs',
    timeInMinutes: 120,
    impactEstimate: '15,000 residents, 12 villages',
    coordinates: [30.0869, 78.2676],
    status: 'Active',
    radius: 15000, // meters
    aiModel: 'FloodNet-v3.2',
    lastUpdated: new Date(),
    evacuationZones: [
      { name: 'Zone A', priority: 'High', population: 5000 },
      { name: 'Zone B', priority: 'Medium', population: 7000 },
      { name: 'Zone C', priority: 'Low', population: 3000 }
    ]
  },
  {
    id: 'pred_2',
    type: 'Earthquake',
    region: 'Shimla, Himachal Pradesh',
    severity: 'Moderate',
    confidence: 72,
    predictedTime: '6 hrs',
    timeInMinutes: 360,
    impactEstimate: '8,000 residents, 5 villages',
    coordinates: [31.1048, 77.1734],
    status: 'Monitoring',
    radius: 25000,
    aiModel: 'SeismoPredict-v2.1',
    lastUpdated: new Date()
  }
];

let RESOURCES = [
  {
    id: 'boat_1',
    type: 'Rescue Boat',
    status: 'Available',
    fuel: 'Full',
    lat: 30.0900,
    lng: 78.2700,
    team: 'NDRF Team Alpha',
    capacity: 20,
    lastUpdate: new Date()
  },
  {
    id: 'boat_2',
    type: 'Rescue Boat',
    status: 'Refueling',
    fuel: 'Low',
    lat: 30.0800,
    lng: 78.2600,
    team: 'NDRF Team Bravo',
    capacity: 20,
    lastUpdate: new Date()
  },
  {
    id: 'amb_1',
    type: 'Ambulance',
    status: 'Available',
    fuel: 'Full',
    lat: 30.1000,
    lng: 78.2800,
    team: 'Medical Unit 1',
    capacity: 4,
    lastUpdate: new Date()
  },
  {
    id: 'amb_2',
    type: 'Ambulance',
    status: 'In Transit',
    fuel: 'Medium',
    lat: 30.0850,
    lng: 78.2650,
    team: 'Medical Unit 2',
    capacity: 4,
    lastUpdate: new Date()
  },
  {
    id: 'shelter_1',
    type: 'Shelter',
    status: 'Open',
    capacity: 5000,
    occupancy: 0,
    lat: 30.1100,
    lng: 78.2900,
    name: 'Govt School Dehradun Rd',
    lastUpdate: new Date()
  },
  {
    id: 'helicopter_1',
    type: 'Rescue Helicopter',
    status: 'Available',
    fuel: 'Full',
    lat: 30.0950,
    lng: 78.2750,
    team: 'Air Rescue Unit 1',
    capacity: 10,
    lastUpdate: new Date()
  },
  {
    id: 'truck_1',
    type: 'Supply Truck',
    status: 'Busy',
    fuel: 'Full',
    lat: 30.0880,
    lng: 78.2680,
    team: 'Logistics Team 1',
    capacity: 5000,
    lastUpdate: new Date()
  }
];

const ALERTS_LOG = [];
const AGENCIES = [
  { id: 'ndrf', name: 'NDRF', status: 'Active', responseTime: '15 min', personnel: 45 },
  { id: 'police', name: 'State Police', status: 'Active', responseTime: '10 min', personnel: 120 },
  { id: 'fire', name: 'Fire Services', status: 'Active', responseTime: '12 min', personnel: 60 },
  { id: 'medical', name: 'Medical Emergency', status: 'Active', responseTime: '8 min', personnel: 80 },
  { id: 'army', name: 'Indian Army', status: 'On Standby', responseTime: '30 min', personnel: 200 }
];

const ANALYTICS_DATA = {
  predictionsLast30Days: 47,
  accuracyRate: 89.5,
  avgResponseTime: '18 minutes',
  livesImpacted: 125000,
  successfulEvacuations: 42,
  resourcesDeployed: 234,
  agenciesCoordinated: 17
};

// --- Blockchain Simulation ---
const BLOCKCHAIN = [];

function addToBlockchain(type, data) {
  const block = {
    id: uuidv4(),
    type,
    data,
    timestamp: new Date(),
    hash: `0x${Math.random().toString(16).substring(2, 18)}`
  };
  BLOCKCHAIN.push(block);
  return block;
}

// --- WebSocket Real-time Updates ---
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Send initial data
  socket.emit('predictions', DISASTER_PREDICTIONS);
  socket.emit('resources', RESOURCES);
  socket.emit('agencies', AGENCIES);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Simulate real-time updates
setInterval(() => {
  // Update confidence scores
  DISASTER_PREDICTIONS = DISASTER_PREDICTIONS.map(pred => ({
    ...pred,
    confidence: Math.min(95, pred.confidence + Math.random() * 2 - 0.5),
    lastUpdated: new Date()
  }));

  // Update resource positions slightly
  RESOURCES = RESOURCES.map(res => {
    if (res.type !== 'Shelter') {
      return {
        ...res,
        lat: res.lat + (Math.random() - 0.5) * 0.001,
        lng: res.lng + (Math.random() - 0.5) * 0.001,
        lastUpdate: new Date()
      };
    }
    return res;
  });

  io.emit('predictions', DISASTER_PREDICTIONS);
  io.emit('resources', RESOURCES);
}, 5000);

// --- REST API Endpoints ---

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    uptime: process.uptime(),
    connections: io.engine.clientsCount
  });
});

app.get('/api/predictions', (req, res) => {
  res.json(DISASTER_PREDICTIONS);
});

app.get('/api/predictions/:id', (req, res) => {
  const prediction = DISASTER_PREDICTIONS.find(p => p.id === req.params.id);
  if (prediction) {
    res.json(prediction);
  } else {
    res.status(404).json({ error: 'Prediction not found' });
  }
});

app.get('/api/resources', (req, res) => {
  res.json(RESOURCES);
});

app.post('/api/resources/:id/dispatch', (req, res) => {
  const { destination } = req.body;
  const resource = RESOURCES.find(r => r.id === req.params.id);

  if (resource) {
    resource.status = 'In Transit';
    resource.lastUpdate = new Date();

    const block = addToBlockchain('RESOURCE_DISPATCH', {
      resourceId: resource.id,
      destination,
      timestamp: new Date()
    });

    io.emit('resources', RESOURCES);
    res.json({ success: true, resource, blockchain: block });
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

app.get('/api/agencies', (req, res) => {
  res.json(AGENCIES);
});

app.post('/api/alerts', (req, res) => {
  const { type, message, target, channels, region } = req.body;
  const newAlert = {
    id: uuidv4(),
    type,
    message,
    target,
    channels: channels || ['SMS', 'Push'],
    region,
    timestamp: new Date(),
    status: 'Dispatched',
    deliveryStats: {
      sent: Math.floor(Math.random() * 10000) + 5000,
      delivered: 0,
      failed: 0
    }
  };

  ALERTS_LOG.push(newAlert);

  // Add to blockchain
  const block = addToBlockchain('ALERT_DISPATCHED', newAlert);

  // Simulate delivery updates
  setTimeout(() => {
    newAlert.deliveryStats.delivered = Math.floor(newAlert.deliveryStats.sent * 0.95);
    newAlert.deliveryStats.failed = newAlert.deliveryStats.sent - newAlert.deliveryStats.delivered;
    newAlert.status = 'Completed';
  }, 2000);

  io.emit('new-alert', newAlert);

  console.log('🚨 ALERT DISPATCHED:', newAlert);
  res.json({ success: true, alert: newAlert, blockchain: block });
});

app.get('/api/alerts/history', (req, res) => {
  res.json(ALERTS_LOG);
});

app.get('/api/analytics', (req, res) => {
  res.json(ANALYTICS_DATA);
});

app.get('/api/blockchain', (req, res) => {
  res.json(BLOCKCHAIN);
});

// ============================================
// 🌍 REAL DATA ENDPOINTS (Open-Meteo & USGS)
// ============================================

// Real weather data from Open-Meteo
app.get('/api/weather/:region', async (req, res) => {
  try {
    const region = req.params.region.toLowerCase();
    const coords = INDIA_REGIONS[region] || { lat: 28.61, lng: 77.20, name: region };

    const weatherData = await fetchWeather(coords.lat, coords.lng);

    if (weatherData.success) {
      res.json({
        region: coords.name,
        temperature: weatherData.current.temperature,
        humidity: weatherData.current.humidity,
        rainfall: weatherData.current.precipitation,
        windSpeed: weatherData.current.windSpeed,
        conditions: getWeatherDescription(weatherData.current.weatherCode),
        source: 'Open-Meteo API',
        timestamp: weatherData.timestamp
      });
    } else {
      // Fallback to simulated data if API fails
      res.json({
        region: coords.name,
        temperature: Math.floor(Math.random() * 15) + 20,
        humidity: Math.floor(Math.random() * 40) + 60,
        rainfall: Math.floor(Math.random() * 200),
        windSpeed: Math.floor(Math.random() * 30) + 10,
        conditions: 'Data unavailable',
        source: 'Fallback',
        timestamp: new Date()
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Real earthquake data from USGS
app.get('/api/earthquakes', async (req, res) => {
  try {
    const { magnitude = '2.5', period = 'day' } = req.query;
    const data = await fetchEarthquakes(magnitude, period);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earthquake data' });
  }
});

// Flood data from Open-Meteo
app.get('/api/floods/:region', async (req, res) => {
  try {
    const region = req.params.region.toLowerCase();
    const coords = INDIA_REGIONS[region] || INDIA_REGIONS.rishikesh;

    const data = await fetchFloodData(coords.lat, coords.lng);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flood data' });
  }
});

// AI Risk Score calculation
app.get('/api/risk/:region', async (req, res) => {
  try {
    const region = req.params.region.toLowerCase();
    const riskData = await calculateRiskScore(region);
    res.json(riskData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate risk score' });
  }
});

// Get available regions
app.get('/api/regions', (req, res) => {
  res.json({
    regions: Object.entries(INDIA_REGIONS).map(([key, value]) => ({
      id: key,
      name: value.name,
      coordinates: { lat: value.lat, lng: value.lng }
    }))
  });
});

// Live feed endpoint
app.get('/api/feed', (req, res) => {
  const feed = [
    {
      id: 1,
      time: new Date(Date.now() - 120000).toISOString(),
      source: 'IMD API',
      message: 'Heavy rainfall alert (150mm) received.',
      severity: 'high'
    },
    {
      id: 2,
      time: new Date(Date.now() - 180000).toISOString(),
      source: 'AI Engine',
      message: 'Risk score updated to 9/10.',
      severity: 'critical'
    },
    {
      id: 3,
      time: new Date(Date.now() - 300000).toISOString(),
      source: 'Sensor Network',
      message: 'Water level in Ganges +2m above normal.',
      severity: 'warning'
    },
    {
      id: 4,
      time: new Date(Date.now() - 420000).toISOString(),
      source: 'Satellite',
      message: 'Cloud formation detected in northern region.',
      severity: 'info'
    },
    {
      id: 5,
      time: new Date(Date.now() - 540000).toISOString(),
      source: 'NDRF',
      message: 'Team Alpha deployed to evacuation zone.',
      severity: 'info'
    }
  ];
  res.json(feed);
});

// Citizen reports endpoint
app.post('/api/citizen-report', (req, res) => {
  const report = {
    id: uuidv4(),
    ...req.body,
    timestamp: new Date(),
    status: 'Received'
  };

  addToBlockchain('CITIZEN_REPORT', report);
  io.emit('citizen-report', report);

  res.json({ success: true, report });
});

// ============================================
// 🔐 AUTHENTICATION ENDPOINTS
// ============================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, agency } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const user = await registerUser({ email, password, name, role, agency });
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await loginUser(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user profile (protected)
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Get all users (admin only)
app.get('/api/auth/users', authMiddleware, requireRole(ROLES.ADMIN), (req, res) => {
  const users = getAllUsers();
  res.json({ users });
});

// ============================================

// Start server with user seeding
server.listen(PORT, async () => {
  // Seed default users
  await seedDefaultUsers();

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   🚨 DisasterSync Server ONLINE 🚨        ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`\n📡 REST API: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`⛓️  Blockchain: Active`);
  console.log(`🤖 AI Engine: Simulated`);
  console.log(`🔐 Auth: JWT Enabled\n`);
});
