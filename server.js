require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected")).catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",").map((s) => s.trim()).filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length === 0 ? true : allowedOrigins,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Routes
const apiAuthRouter = require("./routes/apiAuth");
const saveRouter = require("./routes/save");
const userRouter = require("./routes/user");

console.log("apiAuthRouter type:", typeof apiAuthRouter);
console.log("saveRouter type:", typeof saveRouter);
console.log("userRouter type:", typeof userRouter);

app.use("/api/auth", apiAuthRouter);
app.use("/api/save", saveRouter);
app.use("/user", userRouter);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
