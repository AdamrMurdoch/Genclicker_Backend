require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

const app = express();

const parseOrigins = (value) =>
  (value || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const allowedOriginStrings = parseOrigins(process.env.CORS_ORIGINS);
const allowAllOrigins = allowedOriginStrings.length === 0 || allowedOriginStrings.includes("*");

const originMatchers = allowedOriginStrings
  .filter((origin) => origin !== "*")
  .map((origin) => {
    if (!origin.includes("*")) 
    {
      return (incoming) => incoming === origin;
    }

    const regex = new RegExp(`^${origin.split("*").map(escapeRegex).join(".*")}$`);
    return (incoming) => regex.test(incoming);
  });

const isOriginAllowed = (origin) => {
  if (!origin || allowAllOrigins) 
  {
    return true;
  }

  return originMatchers.some((matcher) => matcher(origin));
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) 
    {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => 
{
  res.send("Backend is running");
});

const apiAuthRouter = require("./routes/apiAuth");
const saveRouter = require("./routes/save");
const userRouter = require("./routes/user");

console.log("apiAuthRouter type:", typeof apiAuthRouter);
console.log("saveRouter type:", typeof saveRouter);
console.log("userRouter type:", typeof userRouter);

app.use("/api/auth", apiAuthRouter);
app.use("/api/save", saveRouter);
app.use("/user", userRouter);

app.listen(port, () => 
{
  console.log(`Server listening on port ${port}`);
});
