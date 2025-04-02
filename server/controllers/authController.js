// server/controllers/authController.js
const User = require("../models/User");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

// --- Register New User (Email/Password) ---
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Password will be hashed by the pre-save hook in the model
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- Login User (Email/Password) ---
const loginUser = (req, res, next) => {
  // Use passport.authenticate middleware for local strategy
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Handle server error
    }
    if (!user) {
      // Authentication failed (incorrect credentials or other reason from strategy)
      return res.status(401).json({ message: info.message || "Login failed" });
    }
    // Authentication successful, generate token and send response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id),
    });
  })(req, res, next); // Don't forget to call the middleware function
};

// --- Initiate Google OAuth ---
const googleAuth = (req, res, next) => {
  // Get redirect path from query param (passed from frontend)
  const { redirect } = req.query;
  const state = redirect ? encodeURIComponent(redirect) : undefined;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state, // Pass the encoded redirect path in the state parameter
  })(req, res, next);
};

// --- Google OAuth Callback ---
const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("Google Callback Error:", err);
      // Redirect to frontend login page with error message
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_oauth_failed`
      );
    }
    if (!user) {
      // Redirect to frontend login page with error message from strategy
      const message = info?.message || "google_login_failed";
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`
      );
    }

    // --- Success ---
    const token = generateToken(user._id);
    // Get the original redirect URL from the info object (passed from strategy)
    const redirectUrl = info?.redirectUrl || "/"; // Default to home if not found

    // Redirect back to the frontend, passing the token and the original redirect path
    // The frontend will handle storing the token and navigating
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&redirect=${encodeURIComponent(redirectUrl)}`
    );
  })(req, res, next);
};

// --- Initiate GitHub OAuth ---
const githubAuth = (req, res, next) => {
  const { redirect } = req.query;
  const state = redirect ? encodeURIComponent(redirect) : undefined;

  passport.authenticate("github", {
    scope: ["user:email"],
    state: state,
  })(req, res, next);
};

// --- GitHub OAuth Callback ---
const githubCallback = (req, res, next) => {
  passport.authenticate("github", (err, user, info) => {
    if (err) {
      console.error("GitHub Callback Error:", err);
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=github_oauth_failed`
      );
    }
    if (!user) {
      const message = info?.message || "github_login_failed";
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`
      );
    }

    // --- Success ---
    const token = generateToken(user._id);
    const redirectUrl = info?.redirectUrl || "/";

    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&redirect=${encodeURIComponent(redirectUrl)}`
    );
  })(req, res, next);
};

// --- Get Current User Profile (Protected) ---
const getUserProfile = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt,
    });
  } else {
    res.status(404).json({ message: "User not found" }); // Should not happen if protect middleware works
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getUserProfile,
};