const { saveTemplate, ensureTemplatesDir } = require('./utils/excelUtils');
const path = require('path');

// Ensure templates directory exists
const templatesDir = ensureTemplatesDir();
const templatePath = path.join(templatesDir, 'sample_template.xlsx');

// Create the template
if (saveTemplate(templatePath)) {
    console.log('✅ Template created successfully at:', templatePath);
} else {
    console.log('❌ Failed to create template');
}
