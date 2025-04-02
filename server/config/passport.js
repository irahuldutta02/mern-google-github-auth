// server/config/passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = function (passport) {
  // --- Local Strategy (Email/Password) ---
  passport.use(
    new LocalStrategy(
      { usernameField: "email" }, // We use email as the username
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          // Check if user registered via OAuth without setting a password
          if (!user.password) {
            return done(null, false, {
              message:
                "You registered using a social account. Please log in with that method or set a password.",
            });
          }

          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          return done(null, user); // Success
        } catch (err) {
          return done(err); // Server error
        }
      }
    )
  );

  // --- Google OAuth 2.0 Strategy ---
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"], // Request profile and email info
        passReqToCallback: true, // Allows passing req to the callback
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const { state } = req.query; // Get the redirect path from state
        const redirectUrl = state ? decodeURIComponent(state) : "/"; // Default redirect

        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatarUrl: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User exists, log them in
            return done(null, user, { redirectUrl });
          } else {
            // Check if user exists with the same email (maybe registered locally or via GitHub)
            user = await User.findOne({ email: newUser.email });
            if (user) {
              // Link Google ID to existing account (optional, handle carefully)
              // For simplicity here, we might tell them to log in differently
              // Or update the existing user:
              user.googleId = newUser.googleId;
              user.avatarUrl = user.avatarUrl || newUser.avatarUrl; // Keep existing avatar if present
              user.name = user.name || newUser.name; // Keep existing name
              await user.save();
              return done(null, user, { redirectUrl });
            } else {
              // Create new user
              user = await User.create(newUser);
              return done(null, user, { redirectUrl });
            }
          }
        } catch (err) {
          console.error("Google OAuth Error:", err);
          return done(err, false);
        }
      }
    )
  );

  // --- GitHub Strategy ---
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"], // Request email scope
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const { state } = req.query;
        const redirectUrl = state ? decodeURIComponent(state) : "/";

        // GitHub might not always provide a public email, handle this
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        if (!email) {
          // Handle case where email is not provided by GitHub
          return done(null, false, {
            message:
              "GitHub profile does not have a public email. Please add one or use another login method.",
            // You might redirect to a page explaining this
          });
        }

        const newUser = {
          githubId: profile.id,
          name: profile.displayName || profile.username, // Use username if display name is null
          email: email,
          avatarUrl: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(null, user, { redirectUrl });
          } else {
            user = await User.findOne({ email: newUser.email });
            if (user) {
              // Link GitHub ID
              user.githubId = newUser.githubId;
              user.avatarUrl = user.avatarUrl || newUser.avatarUrl;
              user.name = user.name || newUser.name;
              await user.save();
              return done(null, user, { redirectUrl });
            } else {
              // Create new user
              user = await User.create(newUser);
              return done(null, user, { redirectUrl });
            }
          }
        } catch (err) {
          console.error("GitHub OAuth Error:", err);
          return done(err, false);
        }
      }
    )
  );

  // --- Session Management (Primarily for OAuth flow state) ---
  // Although we use JWT for API auth, Passport uses sessions during the OAuth redirect flow.
  passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user); // Attach user object to req.user
    } catch (err) {
      done(err);
    }
  });
};