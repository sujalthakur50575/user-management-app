const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Check file extension
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
        files: 1 // Only allow 1 file
    },
    fileFilter: fileFilter
});

// Middleware for single file upload
const uploadSingle = upload.single('excelFile');

// Enhanced upload middleware with error handling
const uploadMiddleware = (req, res, next) => {
    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer-specific errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size allowed is 5MB.'
                });
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Only one file is allowed.'
                });
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    success: false,
                    message: 'Unexpected file field. Use "excelFile" as the field name.'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
            }
        } else if (err) {
            // Handle other errors (e.g., file filter errors)
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please select an Excel file.'
            });
        }

        // Add file info to request
        req.uploadedFile = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype
        };

        next();
    });
};

// Cleanup function to delete uploaded files
const cleanupFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

module.exports = {
    uploadMiddleware,
    cleanupFile,
    uploadDir
};
