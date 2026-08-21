import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Health Check Endpoint (Dành cho UptimeRobot ping giữ server luôn thức 24/7)
app.get(["/", "/health"], (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "ZComputer API Server is awake and running",
    timestamp: new Date().toISOString(),
  });
});

// Apply Global Rate Limiting to all /api routes
app.use("/api", globalLimiter);

// API Root
app.use("/api/v1", routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
