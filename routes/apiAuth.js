require("dotenv").config();
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Utils = require("../utils");
const { requireAuth } = require("../middleware/auth");

// Helper: normalize user response to what Unity expects
function toAuthUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    username: userDoc.username,
    email: userDoc.email,
  };
}

/**
 * POST /api/auth/register
 * Unity sends: { username, email, password }
 * Returns: { token, user }
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "email already in use" });
    }

    const newUser = new User({ username, email, password });
    const saved = await newUser.save();

    const userObject = toAuthUser(saved);
    const token = Utils.generateAccessToken(userObject);

    return res.status(201).json({ token, user: userObject });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "problem creating account" });
  }
});

/**
 * POST /api/auth/login
 * Unity sends: { username, password }
 * But we also allow: { email, password } to be flexible.
 * Returns: { token, user }
 */
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    const identifier = (email || username || "").trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: "username/email and password are required" });
    }

    // Try email first if it looks like an email; otherwise try username
    let user = null;

    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    }
    if (!user) {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(400).json({ message: "This account does not exist" });
    }

    const ok = Utils.verifyPassword(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Password or username/email is incorrect" });
    }

    const userObject = toAuthUser(user);
    const token = Utils.generateAccessToken(userObject);

    return res.json({ token, user: userObject });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "problem signing in" });
  }
});

/**
 * GET /api/auth/me
 * Requires Authorization: Bearer <token>
 * Returns: { id, username, email }
 */
router.get("/me", requireAuth, async (req, res) => {
  return res.json(req.user);
});

module.exports = router;