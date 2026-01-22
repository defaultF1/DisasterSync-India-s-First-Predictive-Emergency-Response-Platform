const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Mongoose Model

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET;

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables!');
    console.error('   Please set JWT_SECRET in your .env file.');
    console.error('   You can generate a secure key using:');
    console.error('   node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    process.exit(1);
}

const JWT_EXPIRES_IN = '24h';
const REFRESH_EXPIRES_IN = '7d';

// User roles
const ROLES = {
    ADMIN: 'admin',
    COMMANDER: 'commander',
    RESPONDER: 'responder',
    PUBLIC: 'public'
};

// Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

// Generate JWT tokens
const generateTokens = (user) => {
    const payload = {
        id: user._id, // MongoDB ID
        email: user.email,
        role: user.role,
        agency: user.agency
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

    return { accessToken, refreshToken };
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Register new user
const registerUser = async (userData) => {
    const { email, password, name, role = ROLES.RESPONDER, agency } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in MongoDB
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        agency: agency || 'Unknown',
        lastLogin: null
    });

    // Return user without password
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        agency: user.agency
    };
};

// Login user
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);

    // Return user without password
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            agency: user.agency
        },
        ...tokens
    };
};

// Auth middleware - protect routes
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    req.user = decoded;
    next();
};

// Role-based access control middleware
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
        }

        next();
    };
};

// Get all users (admin only)
const getAllUsers = async () => {
    return await User.find().select('-password');
};

// Seed default admin user
const seedDefaultUsers = async () => {
    // Validate required environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.error('⚠️  ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file to seed admin user.');
        console.error('   Skipping admin user creation for security reasons.');
        return;
    }

    if (!process.env.COMMANDER_EMAIL || !process.env.COMMANDER_PASSWORD) {
        console.error('⚠️  COMMANDER_EMAIL and COMMANDER_PASSWORD must be set in .env file.');
        console.error('   Skipping commander user creation for security reasons.');
        return;
    }

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!existingAdmin) {
        await registerUser({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            name: 'NDRF Admin',
            role: ROLES.ADMIN,
            agency: 'NDRF'
        });

        await registerUser({
            email: process.env.COMMANDER_EMAIL,
            password: process.env.COMMANDER_PASSWORD,
            name: 'District Commander',
            role: ROLES.COMMANDER,
            agency: 'State Police'
        });

        console.log('🔐 Default users seeded in MongoDB');
    }
};

module.exports = {
    ROLES,
    registerUser,
    loginUser,
    authMiddleware,
    requireRole,
    getAllUsers,
    seedDefaultUsers,
    verifyToken
};
