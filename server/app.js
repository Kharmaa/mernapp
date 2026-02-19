const express = require("express");

const workoutRoutes = require("./routes/workout-routes");
const userRoutes = require("./routes/user-routes");
const workoutTypeRoutes = require("./routes/workout-type-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("INCOMING:", req.method, req.originalUrl);
  next();
});

// CORS MIDDLEWARE
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
app.use("/api/types", workoutTypeRoutes);

app.get("/ping", (req, res) => res.json({ ok: true }));

app.use((req, res, next) => {
  const error = new HttpError("Reittiä ei löytynyt", 404);
  next(error); // parempi kuin throw middlewareissa
});

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown error" });
});

module.exports = app;
