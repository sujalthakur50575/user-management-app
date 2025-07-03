# Full-Stack User Management App

This is a complete full-stack application for managing users, built with React and Node.js (Express). It provides a comprehensive set of features for user administration, including CRUD operations, bulk data management via Excel, and a responsive user interface.

## ✨ Features

- **Full CRUD Functionality**: Create, Read, Update, and Delete users.
- **Bulk User Upload**: Upload multiple users at once using an Excel file (`.xlsx` or `.xls`).
- **Excel Template**: Download a pre-formatted Excel template to ensure correct data entry.
- **Data Validation**: Robust server-side and client-side validation for all user fields:
  - **Email**: Valid format.
  - **Phone**: Valid Indian phone number format.
  - **PAN**: Valid Indian PAN card format.
  - **Date of Birth**: Ensures user is between 18 and 100 years old.
- **PAN Masking**: PAN numbers are masked by default in the user list for security. A toggle allows viewing the unmasked number.
- **Toast Notifications**: Interactive feedback for all user actions (success, error, loading).
- **Responsive UI**: The application is fully responsive and works on all screen sizes.
- **In-Memory Database**: Uses a simple in-memory database, making it easy to run without any database setup.
- **Search & Filter**: Instantly search for users by name, email, or phone number.
- **Export Users**: Export the complete user list to an Excel file.

## 🚀 Tech Stack

**Frontend:**
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: For static typing and improved developer experience.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **React Router**: For client-side routing.
- **Axios**: For making HTTP requests to the backend.
- **`react-hot-toast`**: For providing toast notifications.
- **`lucide-react`**: For beautiful and consistent icons.

**Backend:**
- **Node.js**: A JavaScript runtime for the server.
- **Express**: A fast and minimalist web framework for Node.js.
- **`xlsx`**: For parsing and generating Excel files.
- **`multer`**: Middleware for handling file uploads.
- **`joi`**: For powerful data validation.
- **`cors`**: For enabling Cross-Origin Resource Sharing.
- **`dotenv`**: For managing environment variables.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (v14 or later)
- **npm** (v6 or later), which comes with Node.js

## ⚙️ How to Run Locally

Follow these steps to get the application running on your local machine.

### 1. Clone the Repository

```bash
# Since this is generated locally, you can skip this step.
# If this were a GitHub repo, you would run:
# git clone https://github.com/your-username/user-management-app.git
# cd user-management-app
```

### 2. Set Up the Backend

First, navigate to the `backend` directory and install the dependencies.

```bash
cd backend
npm install
```

Next, start the backend server.

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 3. Set Up the Frontend

Open a new terminal window, navigate to the `frontend` directory, and install the dependencies.

```bash
cd frontend
npm install
```

Next, start the React development server.

```bash
npm start
```

The frontend will open in your browser at `http://localhost:3000`.

### 4. You're All Set! 🎉

The application should now be running. You can start by:
- **Adding a new user** using the form.
- **Downloading the Excel template** from the "Bulk Upload" screen.
- **Uploading an Excel file** with user data.

## 📁 Project Structure

Here is a brief overview of the project's directory structure:

```
user-management-app/
├── backend/
│   ├── controllers/      # Express controllers for handling business logic
│   ├── middleware/       # Custom middleware (e.g., file upload)
│   ├── models/           # Data models (in-memory user model)
│   ├── routes/           # API routes
│   ├── templates/        # Stores the generated Excel template
│   ├── uploads/          # Directory for temporary file uploads
│   ├── utils/            # Utility functions (validation, Excel handling)
│   ├── .env              # Environment variables
│   ├── server.js         # Main Express server file
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # Reusable React components
    │   ├── pages/          # Main page components
    │   ├── services/       # API service for communicating with the backend
    │   ├── types/          # TypeScript type definitions
    │   ├── utils/          # Utility functions for the frontend
    │   ├── App.tsx         # Main application component
    │   ├── index.tsx       # Entry point of the React app
    │   └── ...
    ├── public/
    ├── tailwind.config.js  # Tailwind CSS configuration
    └── package.json
```

## 📝 API Endpoints

All endpoints are prefixed with `/api/users`.

- `GET /`: Get all users.
- `GET /:id`: Get a single user by ID.
- `GET /:id/edit`: Get a user with an unmasked PAN for editing.
- `POST /`: Create a new user.
- `PUT /:id`: Update an existing user.
- `DELETE /:id`: Delete a user.
- `GET /stats`: Get user statistics.
- `GET /search`: Search for users.
- `GET /excel/template`: Download the sample Excel template.
- `POST /excel/upload`: Upload an Excel file to create users in bulk.
- `GET /excel/export`: Export all users to an Excel file.

## 💡 How to Use Bulk Upload

1.  Click the **Bulk Upload** button on the main screen.
2.  Click **Download Excel Template** to get a `.xlsx` file with the correct headers.
3.  Open the template and fill in the user details. The expected columns are:
    - `firstName`
    - `lastName`
    - `email`
    - `phone`
    - `pan`
    - `dateOfBirth`
    - `address`
4.  Save the file.
5.  Drag and drop the file onto the upload area or click **Select File**.
6.  The system will process the file, and you will see a summary of successful and failed uploads.

---
