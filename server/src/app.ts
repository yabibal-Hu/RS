import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import router from "./routes/index";
// import { processMonitor } from "./middleware/processMonitor";
// import { connectionLimit } from "./middleware/connectionLimit";
// import { setupSelfKill } from "./utils/selfKill";



const app = express();
const port = process.env.PORT || 3000;

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  }),
);

// const updateLastRequest = setupSelfKill(300000); // 5 minutes idle = kill
// app.use((req, res, next) => {
//   updateLastRequest(); // Update idle timer
//   next();
// });
// In app.ts - add before your routes
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Security headers for mobile
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");

  next();
});

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000 ,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for whitelisted IPs
    const whitelistedIPs = ["YOUR_IP_ADDRESS", "127.0.0.1"];
    return whitelistedIPs.includes(req.ip ?? "");
  },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    error: "Too many upload requests, please try again later.",
  },
});

// Apply general rate limiting to all requests
app.use(generalLimiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Static files with security headers
app.use(
  "/uploads",
  uploadLimiter,
  express.static(path.join(__dirname, "uploads"), {
    // express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.set("Cross-Origin-Resource-Policy", "same-site");
      res.set("X-Content-Type-Options", "nosniff");
      res.set("X-Frame-Options", "DENY");

      if (filePath.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        res.set("Cache-Control", "public, max-age=86400");
      } else if (filePath.match(/\.(js|css)$/)) {
        res.set("Cache-Control", "public, max-age=31536000");
      } else {
        res.set("Cache-Control", "public, max-age=3600");
      }
    },
    index: false,
    dotfiles: "deny",
  }),
);

app.use(express.static("public"));



// API routes
app.use("/api", router);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ FIXED: Proper 404 handler - Place this AFTER all other routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", {
      message: error.message,
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    // Prisma errors
    if (error.code) {
      switch (error.code) {
        case "P2002":
          return res.status(409).json({
            error: "Conflict",
            message: "Record already exists",
          });
        case "P2025":
          return res.status(404).json({
            error: "Not Found",
            message: "Record not found",
          });
      }
    }

    const statusCode = error.statusCode || 500;
    const isProduction = process.env.NODE_ENV === "production";

    res.status(statusCode).json({
      error:
        isProduction && statusCode === 500
          ? "Internal server error"
          : error.message,
      ...(!isProduction && { stack: error.stack }),
    });
  },
);
// app.use(connectionLimit);

// Add process monitoring (after connection limiting)
// app.use(processMonitor);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully`);

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
const server = app.listen(port, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || "development"} mode
📍 Port: ${port}
📅 Started: ${new Date().toISOString()}
  `);
});

export default app;
