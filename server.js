require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 3000;

// --------------------
// MongoDB connection
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// --------------------
// Express app
// --------------------
const app = express();

// --------------------
// CORS configuration
// --------------------
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Unity, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow localhost during development
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("https://localhost:")
      ) {
        return callback(null, true);
      }

      // If no CORS_ORIGINS set, allow all
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --------------------
// Body parsing
// --------------------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------
// Health check
// --------------------
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// --------------------
// Routes
// --------------------
const apiAuthRouter = require("./routes/apiAuth");
const saveRouter = require("./routes/save");
const userRouter = require("./routes/user"); // optional/debug

console.log("apiAuthRouter type:", typeof apiAuthRouter);
console.log("saveRouter type:", typeof saveRouter);
console.log("userRouter type:", typeof userRouter);

app.use("/api/auth", apiAuthRouter);
app.use("/api/save", saveRouter);
app.use("/user", userRouter);

// --------------------
// Start server
// --------------------
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});