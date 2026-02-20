require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Utils = require("../utils");
const { requireAuth } = require("../middleware/auth");

function toAuthUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    username: userDoc.username,
    email: userDoc.email,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    //Checks if all of the required input fields have been filled out
    if (!username || !email || !password) 
    {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    // Checks if there is already an account with that email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) 
    {
      return res.status(400).json({ message: "email already in use" });
    }

    // Checks if the inputted username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) 
    {
      return res.status(400).json({ message: "username already in use" });
    }

    //If all details are inputted properly the user account will be created and saved
    const newUser = new User({ username, email, password });
    const saved = await newUser.save();

    const userObject = toAuthUser(saved);
    const token = Utils.generateAccessToken(userObject);

    return res.status(201).json({ token, user: userObject });
  } 
  catch (err) 
  {
    console.error("Register error:", err);
    return res.status(500).json({
      message: "problem creating account",
      error: err?.message || String(err),
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    const identifier = (email || username || "").trim();

    // Checks if any required input fields are empty
    if (!identifier || !password) 
    {
      return res.status(400).json({ message: "username/email and password are required" });
    }

    let user = null;

    // Checks if user has inputted an email instead of a username. If not it will resort to username as intended.
    if (identifier.includes("@")) 
    {
      user = await User.findOne({ email: identifier });
    }
    if (!user) 
    {
      user = await User.findOne({ username: identifier });
    }

    // Report account as non-existent if user still null after assignment
    if (!user) 
    {
      return res.status(400).json({ message: "This account does not exist" });
    }

    // Decrypts user password and checks it against the inputted password
    const verified = Utils.verifyPassword(password, user.password);
    if (!verified) 
    {
      return res.status(400).json({ message: "Password or username/email is incorrect" });
    }

    const userObject = toAuthUser(user);
    const token = Utils.generateAccessToken(userObject);

    return res.json({ token, user: userObject });
  } 
  catch (err) 
  {
    console.error("Login error:", err);
    return res.status(500).json({ message: "problem signing in" });
  }
});

router.get("/me", requireAuth, async (req, res) => 
{
  return res.json(req.user);
});

module.exports = router;