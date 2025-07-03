const User = require('../models/User');
const {
    validateUser,
    validateUserUpdate,
    validateBulkUsers,
    maskPAN
} = require('../utils/validation');
const {
    parseExcelFile,
    generateExcelFromUsers,
    generateTemplate
} = require('../utils/excelUtils');
const { cleanupFile } = require('../middleware/upload');
const XLSX = require('xlsx');

// Get all users
exports.getAllUsers = (req, res) => {
    const users = User.getAll();
    const maskedUsers = users.map(user => ({
        ...user,
        pan: maskPAN(user.pan)
    }));
    res.json({ success: true, data: maskedUsers });
};

// Get user by ID
exports.getUserById = (req, res) => {
    const { id } = req.params;
    const user = User.getById(id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if this is a request for editing (unmasked PAN)
    const { unmask } = req.query;
    if (unmask === 'true') {
        // Return user with unmasked PAN for editing
        res.json({ success: true, data: user });
    } else {
        // Return user with masked PAN for viewing
        const maskedUser = { ...user, pan: maskPAN(user.pan) };
        res.json({ success: true, data: maskedUser });
    }
};

// Create a new user
exports.createUser = (req, res) => {
    const { error, value } = validateUser(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.details.map(e => e.message) });
    }
    try {
        const newUser = User.create(value);
        res.json({ success: true, data: newUser });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Update user by ID
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { error, value } = validateUserUpdate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.details.map(e => e.message) });
    }
    try {
        const updatedUser = User.update(id, value);
        res.json({ success: true, data: updatedUser });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete user by ID
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = User.delete(id);
        res.json({ success: true, data: deletedUser });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Bulk upload users from Excel
exports.bulkUploadUsers = (req, res) => {
    const filePath = req.uploadedFile.path;
    
    try {
        const { success, data, error } = parseExcelFile(filePath);
        
        if (!success) {
            cleanupFile(filePath);
            return res.status(400).json({ success: false, message: error });
        }
        
        const { validUsers, errors: validationErrors } = validateBulkUsers(data);
        const { createdUsers, errors: creationErrors } = User.createMany(validUsers);
        
        // Combine validation and creation errors
        const allErrors = [...validationErrors, ...creationErrors];
        
        // Clean up uploaded file
        cleanupFile(filePath);
        
        res.json({
            success: true,
            message: `Bulk upload completed. ${createdUsers.length} users created successfully.`,
            summary: {
                totalProcessed: data.length,
                successful: createdUsers.length,
                failed: allErrors.length
            },
            createdUsers: createdUsers.map(user => ({ ...user, pan: maskPAN(user.pan) })),
            errors: allErrors
        });
    } catch (error) {
        cleanupFile(filePath);
        res.status(500).json({ success: false, message: 'Error processing file', error: error.message });
    }
};

// Download sample Excel template
exports.downloadTemplate = (req, res) => {
    try {
        const workbook = generateTemplate();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="user_upload_template.xlsx"');

        // Write workbook to response
        const responseBuffer = Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx', compression: true }));
        res.send(responseBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating template', error: error.message });
    }
};

// Export all users to Excel
exports.exportUsers = (req, res) => {
    try {
        const users = User.getAll();
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found to export' });
        }

        const workbook = generateExcelFromUsers(users);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="users_export.xlsx"');

        const responseBuffer = Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx', compression: true }));
        res.send(responseBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error exporting users', error: error.message });
    }
};

// Get user statistics
exports.getUserStats = (req, res) => {
    try {
        const stats = User.getStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting stats', error: error.message });
    }
};


// Search users
exports.searchUsers = (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const users = User.getAll();
        const filteredUsers = users.filter(user => {
            const searchTerm = query.toLowerCase();
            return (
                user.firstName.toLowerCase().includes(searchTerm) ||
                user.lastName.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.phone.includes(searchTerm)
            );
        });

        const maskedUsers = filteredUsers.map(user => ({
            ...user,
            pan: maskPAN(user.pan)
        }));

        res.json({ success: true, data: maskedUsers, count: maskedUsers.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching users', error: error.message });
    }
};
