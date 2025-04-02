// server/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session"); // Needed for OAuth state persistence
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// --- Middleware ---
// CORS - Allow requests from your React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow only your frontend origin
    credentials: true, // Allow cookies/headers to be sent
  })
);

// Body Parser - To accept JSON data in request body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To handle form submissions

// Express Session - Required by Passport for OAuth flow state
// Even though we use JWT for API auth, session is needed during the redirect dance
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Don't create session until something stored
    // Configure cookie settings as needed (e.g., secure: true in production)
    // cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

// Passport Middleware Initialization
require("./config/passport")(passport); // Pass passport instance to config
app.use(passport.initialize());
app.use(passport.session()); // Allow passport to use express-session

// --- Routes ---
app.get("/", (req, res) => {
  res.send("API is running..."); // Simple check route
});

// Authentication routes
app.use("/api/auth", authRoutes);

// --- Error Handling Middleware (Optional but recommended) ---
// Add custom error handlers here if needed

// --- Start Server ---
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
