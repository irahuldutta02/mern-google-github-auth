// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        // Name is required only if registering via email/password
        return !this.googleId && !this.githubId;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // Password required only for email/password registration
        return !this.googleId && !this.githubId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple nulls, but only one unique value
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple nulls, but only one unique value
    },
    // Add other fields as needed, e.g., profile picture URL
    avatarUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Hash password before saving (only if password is provided/modified)
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new) and exists
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    // User registered via OAuth, no password stored
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);