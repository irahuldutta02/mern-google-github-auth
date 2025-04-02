// server/routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // Import protect middleware

const router = express.Router();

// --- Email/Password Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser); // loginUser now uses passport.authenticate internally

// --- Google OAuth Routes ---
// Route to initiate Google OAuth flow
router.get("/google", googleAuth);
// Route Google redirects to after user grants permission
router.get("/google/callback", googleCallback);

// --- GitHub OAuth Routes ---
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

// --- Protected Route Example ---
// Get user profile - requires authentication
router.get("/profile", protect, getUserProfile); // Apply protect middleware here

module.exports = router;