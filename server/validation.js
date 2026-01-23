const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validation rules
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase, one lowercase, and one number'),
    body('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('role')
        .optional()
        .isIn(['admin', 'commander', 'responder', 'public'])
        .withMessage('Invalid role'),
    body('agency')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Agency name too long')
        .trim()
        .escape(),
    handleValidationErrors
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Alert validation rules
const alertValidation = [
    body('type')
        .notEmpty()
        .withMessage('Alert type is required')
        .isLength({ max: 100 })
        .trim()
        .escape(),
    body('message')
        .notEmpty()
        .withMessage('Alert message is required')
        .isLength({ max: 1000 })
        .withMessage('Message too long (max 1000 chars)')
        .trim(),
    body('target')
        .optional()
        .isLength({ max: 200 })
        .trim()
        .escape(),
    body('region')
        .optional()
        .isLength({ max: 100 })
        .trim()
        .escape(),
    body('channels')
        .optional()
        .isArray()
        .withMessage('Channels must be an array'),
    handleValidationErrors
];

// SMS validation rules
const smsValidation = [
    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Invalid phone number format'),
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ max: 1600 })
        .withMessage('Message too long (max 1600 chars)')
        .trim(),
    handleValidationErrors
];

// Resource dispatch validation
const dispatchValidation = [
    param('id')
        .notEmpty()
        .withMessage('Resource ID is required')
        .isLength({ max: 100 })
        .trim(),
    body('destination')
        .optional()
        .isLength({ max: 200 })
        .trim()
        .escape(),
    body('targetCoordinates')
        .optional()
        .custom((value) => {
            if (!Array.isArray(value)) return false;
            if (value.length !== 2) return false;
            if (typeof value[0] !== 'number' || typeof value[1] !== 'number') return false;
            return true;
        })
        .withMessage('Target coordinates must be [lat, lng] as numbers'),
    handleValidationErrors
];

// Region parameter validation
const regionValidation = [
    param('region')
        .notEmpty()
        .withMessage('Region is required')
        .isLength({ max: 100 })
        .matches(/^[a-zA-Z\s-]+$/)
        .withMessage('Invalid region format')
        .trim(),
    handleValidationErrors
];

// Citizen report validation
const citizenReportValidation = [
    body('type')
        .notEmpty()
        .withMessage('Report type is required')
        .isLength({ max: 100 })
        .trim()
        .escape(),
    body('description')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Description too long')
        .trim(),
    body('location')
        .optional()
        .isLength({ max: 200 })
        .trim()
        .escape(),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    registerValidation,
    loginValidation,
    alertValidation,
    smsValidation,
    dispatchValidation,
    regionValidation,
    citizenReportValidation
};
