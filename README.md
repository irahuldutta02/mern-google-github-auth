# Full-Stack Authentication Application (React, Node.js, ExpressJs, MongoDB)

This project is a full-stack web application demonstrating various authentication methods, including email/password, Google Sign-In, and GitHub Sign-In. It features a React frontend styled with Tailwind CSS and a Node.js/Express backend connected to a MongoDB database.

## Features

- **Multiple Authentication Methods:**
  - Standard Email & Password Registration/Login
  - Sign in with Google (OAuth 2.0)
  - Sign in with GitHub (OAuth 2.0)
- **Page Structure:**
  - **Home Page:** Publicly accessible.
  - **About Page:** Publicly accessible.
  - **Dashboard:** Protected route, accessible only after authentication. Displays basic user details.
- **Contextual Redirection:**
  - Users are redirected back to the page they were on _before_ initiating login/registration (Home, About).
  - Attempting to access the Dashboard while unauthenticated redirects to Login, then back to Dashboard upon successful login.
- **Backend:**
  - Built with Node.js and Express.
  - Uses MongoDB with Mongoose for data modeling and persistence.
  - Passport.js for authentication strategies (local, Google OAuth 2.0, GitHub OAuth 2.0).
  - JSON Web Tokens (JWT) for securing API endpoints.
  - Password hashing using `bcrypt`.
  - Environment variables for configuration and secrets.
- **Frontend:**
  - Built with React (using Vite, TypeScript/JavaScript).
  - Styled with Tailwind CSS.
  - React Router for navigation.
  - React Context API for global authentication state management.
  - Axios for making API requests.
  - Protected routes implementation.
- **Error Handling:** Basic error handling and display of user-friendly messages for authentication failures.

## Technology Stack

- **Frontend:**
  - React
  - React Router (`react-router-dom`)
  - Tailwind CSS
  - Axios
  - TypeScript (or JavaScript)
  - Vite (Build Tool)
- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Passport (`passport`, `passport-local`, `passport-google-oauth20`, `passport-github2`)
  - JSON Web Token (`jsonwebtoken`)
  - Bcrypt (`bcrypt`)
  - Dotenv (`dotenv`)
  - CORS (`cors`)
  - Express Session (`express-session`) - Primarily for OAuth flow state.

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- Git
- Google Cloud Platform Project with OAuth 2.0 Credentials (Client ID & Secret)
- GitHub Application with OAuth Credentials (Client ID & Secret)

## Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Backend Setup:**

    - Navigate to the server directory: `cd server`
    - Install dependencies: `npm install`
    - Create a `.env` file in the `server` directory. Copy the contents from the example below and replace the placeholder values with your actual credentials and configuration.
    - Ensure your MongoDB server is running or your connection string is correct.

3.  **Frontend Setup:**
    - Navigate to the client directory: `cd ../client` (or `cd client` from the root)
    - Install dependencies: `npm install`
    - Create a `.env` file in the `client` directory (or `.env.local` depending on your setup). Add the necessary environment variables (see below).

## Environment Variables

**IMPORTANT:** Never commit your `.env` files to version control. Add them to your `.gitignore` file.

**Backend (`server/.env`):**

```dotenv
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/auth_app # Or your MongoDB Atlas string

# JWT Secret Key (Choose a strong, random string)
JWT_SECRET=your_very_strong_jwt_secret_key

# Server Port
SERVER_PORT=5000

# Frontend URL (For CORS and redirects)
CLIENT_URL=http://localhost:3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
# Callback URL should match the path defined in your Google Cloud Console AND server routes
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# GitHub OAuth Credentials
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
# Callback URL should match the path defined in your GitHub App settings AND server routes
GITHUB_CALLBACK_URL=/api/auth/github/callback

# Express Session Secret (Choose another strong, random string)
SESSION_SECRET=another_strong_secret_for_sessions
```

**Frontend (`client/.env`):**

```dotenv
# URL of your backend API (ensure no trailing slash if handled in api.ts)
VITE_API_BASE_URL=http://localhost:5000/api
```

_(Note: If using Create React App instead of Vite, prefix frontend variables with `REACT_APP_`)_

## Running the Application

1.  **Start the Backend Server:**

    - Navigate to the `server` directory: `cd server`
    - Run: `npm run dev` (uses nodemon for development) or `npm start`

2.  **Start the Frontend Development Server:**

    - Navigate to the `client` directory: `cd ../client` (or `cd client` from root)
    - Run: `npm run dev`

3.  **Access the Application:**
    - Open your browser and go to `http://localhost:3000` (or the port specified by Vite/Create React App).
    - The backend API will be running on `http://localhost:5000` (or the port specified in `server/.env`).

## Project Structure (Simplified)

```
.
├── client/         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/ # Reusable UI components (Navbar, OAuthButtons, ProtectedRoute)
│   │   ├── contexts/   # React Context (AuthContext)
│   │   ├── pages/      # Page components (Home, About, Login, Register, Dashboard, AuthCallback)
│   │   ├── services/   # API service (api.ts)
│   │   ├── App.tsx     # Main application component with routing
│   │   ├── main.tsx    # Application entry point
│   │   └── index.css   # Global styles (including Tailwind directives)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts (or similar for CRA)
│   ├── package.json
│   └── .env          # Frontend environment variables (Gitignored)
│
├── server/         # Node.js Backend
│   ├── config/     # Configuration files (db.js, passport.js)
│   ├── controllers/# Request handlers (authController.js)
│   ├── middleware/ # Custom middleware (authMiddleware.js)
│   ├── models/     # Mongoose models (User.js)
│   ├── routes/     # API routes (authRoutes.js)
│   ├── utils/      # Utility functions (generateToken.js)
│   ├── server.js   # Express server setup and entry point
│   ├── package.json
│   └── .env        # Backend environment variables (Gitignored)
│
├── .gitignore      # Specifies intentionally untracked files
└── README.md       # This file
```

## Security Considerations

- **Password Hashing:** Passwords are securely hashed using `bcrypt` before being stored.
- **JWT Authentication:** API routes are protected using JWTs. Tokens are verified using a secret key stored in environment variables.
- **Environment Variables:** Sensitive information (API keys, secrets, database URIs) is stored in `.env` files and should not be committed to version control.
- **CORS:** The backend uses the `cors` middleware to restrict requests to the allowed frontend origin (`CLIENT_URL`).
- **Input Validation:** Basic input validation is implemented, but consider adding more robust validation (e.g., using `express-validator`) for production applications.
- **HTTPS:** For production deployment, always use HTTPS to encrypt communication between the client and server.
- **Rate Limiting:** Consider implementing rate limiting on authentication endpoints to prevent brute-force attacks.
