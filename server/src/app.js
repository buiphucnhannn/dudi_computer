import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// Disable ETag caching
app.set("etag", false);

// Security Headers (OWASP Standard)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (như Next.js server-side, curl, apps nội bộ)
      if (!origin) return callback(null, true);
      // Cho phép localhost, 127.0.0.1 hoặc mạng LAN 192.168.x.x, 10.x.x.x
      if (
        origin === process.env.CLIENT_URL ||
        /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
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
