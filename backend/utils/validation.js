const Joi = require('joi');

// Custom validation functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    // Indian phone number validation (10 digits, can start with +91)
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

const validatePAN = (pan) => {
    // Indian PAN format validation (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
};

const validateDateOfBirth = (dob) => {
    const date = new Date(dob);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    
    // Check if date is valid and person is between 18 and 100 years old
    return date instanceof Date && !isNaN(date) && age >= 18 && age <= 100;
};

// Joi schema for user validation
const userSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'First name must be at least 2 characters long',
            'string.max': 'First name cannot exceed 50 characters',
            'string.pattern.base': 'First name can only contain letters and spaces',
            'any.required': 'First name is required'
        }),
    
    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'Last name must be at least 2 characters long',
            'string.max': 'Last name cannot exceed 50 characters',
            'string.pattern.base': 'Last name can only contain letters and spaces',
            'any.required': 'Last name is required'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    
    phone: Joi.string()
        .custom((value, helpers) => {
            if (!validatePhone(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.invalid': 'Please provide a valid Indian phone number',
            'any.required': 'Phone number is required'
        }),
    
    pan: Joi.string()
        .custom((value, helpers) => {
            if (!validatePAN(value)) {
                return helpers.error('any.invalid');
            }
            return value.toUpperCase();
        })
        .required()
        .messages({
            'any.invalid': 'Please provide a valid PAN number (format: ABCDE1234F)',
            'any.required': 'PAN number is required'
        }),
    
    dateOfBirth: Joi.date()
        .custom((value, helpers) => {
            if (!validateDateOfBirth(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.invalid': 'Please provide a valid date of birth (age must be between 18-100 years)',
            'any.required': 'Date of birth is required'
        }),
    
    address: Joi.string()
        .trim()
        .min(10)
        .max(200)
        .required()
        .messages({
            'string.min': 'Address must be at least 10 characters long',
            'string.max': 'Address cannot exceed 200 characters',
            'any.required': 'Address is required'
        })
});

// Schema for updating user (all fields optional)
const updateUserSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/),
    
    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/),
    
    email: Joi.string().email(),
    
    phone: Joi.string()
        .custom((value, helpers) => {
            if (!validatePhone(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }),
    
    pan: Joi.string()
        .custom((value, helpers) => {
            if (!validatePAN(value)) {
                return helpers.error('any.invalid');
            }
            return value.toUpperCase();
        }),
    
    dateOfBirth: Joi.date()
        .custom((value, helpers) => {
            if (!validateDateOfBirth(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }),
    
    address: Joi.string()
        .trim()
        .min(10)
        .max(200)
});

// Validate single user
const validateUser = (userData) => {
    return userSchema.validate(userData, { abortEarly: false });
};

// Validate user for update
const validateUserUpdate = (userData) => {
    return updateUserSchema.validate(userData, { abortEarly: false });
};

// Validate bulk users from Excel
const validateBulkUsers = (usersData) => {
    const validUsers = [];
    const errors = [];

    usersData.forEach((userData, index) => {
        const { error, value } = validateUser(userData);
        
        if (error) {
            errors.push({
                row: index + 2, // +2 because Excel rows start from 1 and we skip header
                email: userData.email || 'N/A',
                errors: error.details.map(detail => detail.message)
            });
        } else {
            validUsers.push(value);
        }
    });

    return { validUsers, errors };
};

// Mask PAN number (show only first and last character)
const maskPAN = (pan) => {
    if (!pan || pan.length !== 10) return pan;
    return pan.charAt(0) + '*'.repeat(8) + pan.charAt(9);
};

module.exports = {
    validateUser,
    validateUserUpdate,
    validateBulkUsers,
    validateEmail,
    validatePhone,
    validatePAN,
    validateDateOfBirth,
    maskPAN
};
