const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'disastersync-super-secret-key-2026';
const JWT_EXPIRES_IN = '24h';
const REFRESH_EXPIRES_IN = '7d';

// In-memory user store (replace with MongoDB in Step 2)
const USERS = [];

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
        id: user.id,
        email: user.email,
        role: user.role,
        agency: user.agency
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

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
    const existingUser = USERS.find(u => u.email === email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = {
        id: `user_${Date.now()}`,
        email,
        password: hashedPassword,
        name,
        role,
        agency: agency || 'Unknown',
        createdAt: new Date(),
        lastLogin: null
    };

    USERS.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

// Login user
const loginUser = async (email, password) => {
    const user = USERS.find(u => u.email === email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const tokens = generateTokens(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ...tokens };
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
const getAllUsers = () => {
    return USERS.map(({ password, ...user }) => user);
};

// Seed default admin user
const seedDefaultUsers = async () => {
    if (USERS.length === 0) {
        await registerUser({
            email: 'admin@ndrf.gov.in',
            password: 'Admin@123',
            name: 'NDRF Admin',
            role: ROLES.ADMIN,
            agency: 'NDRF'
        });

        await registerUser({
            email: 'commander@police.gov.in',
            password: 'Commander@123',
            name: 'District Commander',
            role: ROLES.COMMANDER,
            agency: 'State Police'
        });

        console.log('🔐 Default users seeded');
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
