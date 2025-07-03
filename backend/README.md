# User Management App - Backend

A Node.js/Express backend API for managing users with features like user registration, authentication, profile management, and Excel file upload/download functionality.

## Features

- 🔐 User authentication and authorization with JWT
- 👤 User profile management
- 📊 Excel file upload and download for bulk user operations
- 🔍 User search and filtering
- 📝 Input validation with Joi
- 🔒 Password hashing with bcryptjs
- 📁 File upload handling with multer
- 🚀 Development server with hot reload (nodemon)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **File Processing**: xlsx, multer
- **Security**: bcryptjs, cors
- **Development**: nodemon

## Project Structure

```
backend/
├── controllers/     # Business logic controllers
├── middleware/      # Custom middleware functions
├── models/          # Data models and schemas
├── routes/          # API route definitions
├── templates/       # Excel template files
├── uploads/         # File upload directory
├── utils/           # Utility functions
├── .env             # Environment variables
├── server.js        # Main application entry point
├── package.json     # Project dependencies and scripts
└── README.md        # This file
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14.x or higher)
- **npm** (comes with Node.js)

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd user-management-app/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - The `.env` file is already configured with default values
   - Review and modify the following variables if needed:
     ```env
     PORT=5000
     NODE_ENV=development
     JWT_SECRET=your_jwt_secret_key_here_change_in_production
     MAX_FILE_SIZE=5242880
     ALLOWED_FILE_TYPES=.xlsx,.xls
     ```

   ⚠️ **Important**: Change the `JWT_SECRET` to a secure random string in production!

## Running the Application

### Development Mode (Recommended)
Run with nodemon for automatic restart on file changes:
```bash
npm run dev
```

### Production Mode
Run the application in production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## Verifying the Installation

Once the server is running, you can verify it's working by:

1. **Health Check**: Visit `http://localhost:5000/api/health`
   - Should return: `{"message": "Server is running!", "timestamp": "..."}`

2. **API Testing**: Use tools like Postman, curl, or your frontend application to test the endpoints.

## Available API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### File Operations
- `POST /api/users/upload` - Upload Excel file with user data
- `GET /api/users/download` - Download Excel template or user data

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

## Common Issues and Solutions

### Port Already in Use
If you get an "EADDRINUSE" error:

1. **Find the process using port 5000**:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```

2. **Kill the process**:
   ```bash
   # Windows (replace PID with actual process ID)
   taskkill /F /PID <PID>
   
   # macOS/Linux
   kill -9 <PID>
   ```

3. **Or change the port** in your `.env` file:
   ```env
   PORT=3001
   ```

### Module Not Found Errors
If you encounter module import errors:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### File Upload Issues
- Ensure the `uploads/` directory exists (it's created automatically)
- Check file size limits in `.env` (`MAX_FILE_SIZE`)
- Verify allowed file types (`ALLOWED_FILE_TYPES`)

## Development

### Adding New Routes
1. Create controller in `controllers/`
2. Add route in `routes/`
3. Import and use in `server.js`

### Adding Middleware
1. Create middleware function in `middleware/`
2. Apply globally in `server.js` or to specific routes

### Environment Variables
Add new environment variables to:
1. `.env` file (with default values)
2. Document them in this README

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Author

sujal

---

**Need Help?** If you encounter any issues, please check the troubleshooting section above or create an issue in the repository.
