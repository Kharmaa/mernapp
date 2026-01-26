const express = require("express");
const mongoose = require("mongoose");

const workoutRoutes = require("./routes/workout-routes");
const userRoutes = require("./routes/user-routes");

const HttpError = require("./models/http-error");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("INCOMING:", req.method, req.originalUrl);
  next();
});

//CORS MIDDLEWARE
const allowedOrigins = [
  "https://mernapp-umber.vercel.app",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Reittiä ei löytynyt", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Update
