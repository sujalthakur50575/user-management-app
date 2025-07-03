const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Expected Excel columns
const EXPECTED_COLUMNS = [
    'firstName',
    'lastName', 
    'email',
    'phone',
    'pan',
    'dateOfBirth',
    'address'
];

// Generate sample Excel template
const generateTemplate = () => {
    const templateData = [
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+919876543210',
            pan: 'ABCDE1234F',
            dateOfBirth: '1990-01-15',
            address: '123 Main Street, Mumbai, Maharashtra, 400001'
        },
        {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '9876543211',
            pan: 'FGHIJ5678K',
            dateOfBirth: '1985-05-20',
            address: '456 Park Avenue, Delhi, Delhi, 110001'
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    const colWidths = [
        { wch: 15 }, // firstName
        { wch: 15 }, // lastName
        { wch: 25 }, // email
        { wch: 15 }, // phone
        { wch: 12 }, // pan
        { wch: 15 }, // dateOfBirth
        { wch: 40 }  // address
    ];
    worksheet['!cols'] = colWidths;

    // Add header styling (optional - XLSX doesn't support complex styling in free version)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Template');

    return workbook;
};

// Save template to file
const saveTemplate = (outputPath) => {
    try {
        const workbook = generateTemplate();
        XLSX.writeFile(workbook, outputPath);
        return true;
    } catch (error) {
        console.error('Error saving template:', error);
        return false;
    }
};

// Parse Excel file and extract user data
const parseExcelFile = (filePath) => {
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            throw new Error('Excel file is empty or has no data rows');
        }

        // Validate columns
        const firstRow = jsonData[0];
        const actualColumns = Object.keys(firstRow);
        const missingColumns = EXPECTED_COLUMNS.filter(col => !actualColumns.includes(col));
        
        if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }

        // Process and clean data
        const processedData = jsonData.map((row, index) => {
            try {
                // Clean and validate each field
                const userData = {
                    firstName: String(row.firstName || '').trim(),
                    lastName: String(row.lastName || '').trim(),
                    email: String(row.email || '').trim().toLowerCase(),
                    phone: String(row.phone || '').trim(),
                    pan: String(row.pan || '').trim().toUpperCase(),
                    dateOfBirth: parseDate(row.dateOfBirth),
                    address: String(row.address || '').trim()
                };

                // Basic null/empty checks
                Object.keys(userData).forEach(key => {
                    if (!userData[key] || userData[key] === 'undefined' || userData[key] === 'null') {
                        throw new Error(`${key} is required but missing or empty`);
                    }
                });

                return userData;
            } catch (error) {
                throw new Error(`Row ${index + 2}: ${error.message}`);
            }
        });

        return {
            success: true,
            data: processedData,
            totalRows: processedData.length
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// Parse date from various formats
const parseDate = (dateValue) => {
    if (!dateValue) return null;

    // If it's already a Date object
    if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
    }

    // If it's a number (Excel date serial number)
    if (typeof dateValue === 'number') {
        const date = XLSX.SSF.parse_date_code(dateValue);
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }

    // If it's a string, try to parse it
    if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    }

    throw new Error('Invalid date format');
};

// Generate Excel file from user data
const generateExcelFromUsers = (users) => {
    try {
        const excelData = users.map(user => ({
            ID: user.id,
            'First Name': user.firstName,
            'Last Name': user.lastName,
            'Email': user.email,
            'Phone': user.phone,
            'PAN': user.pan,
            'Date of Birth': user.dateOfBirth,
            'Address': user.address,
            'Created At': new Date(user.createdAt).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Set column widths
        const colWidths = [
            { wch: 5 },  // ID
            { wch: 15 }, // First Name
            { wch: 15 }, // Last Name
            { wch: 25 }, // Email
            { wch: 15 }, // Phone
            { wch: 12 }, // PAN
            { wch: 15 }, // Date of Birth
            { wch: 40 }, // Address
            { wch: 15 }  // Created At
        ];
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');

        return workbook;
    } catch (error) {
        throw new Error(`Error generating Excel file: ${error.message}`);
    }
};

// Create upload directory if it doesn't exist
const ensureUploadDir = () => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Create templates directory if it doesn't exist
const ensureTemplatesDir = () => {
    const templatesDir = path.join(__dirname, '..', 'templates');
    if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
    }
    return templatesDir;
};

module.exports = {
    generateTemplate,
    saveTemplate,
    parseExcelFile,
    generateExcelFromUsers,
    ensureUploadDir,
    ensureTemplatesDir,
    EXPECTED_COLUMNS
};
