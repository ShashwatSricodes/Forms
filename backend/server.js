// ============================================
// 📦 backend/server.js
// UPDATED - Add new routes
// ============================================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import formRoutes from "./src/routes/formRoutes.js";
import responseRoutes from "./src/routes/responseRoutes.js";
import mediaRoutes from "./src/routes/mediaRoutes.js"; // ✅ NEW
import brandingRoutes from "./src/routes/brandingRoutes.js"; // ✅ NEW

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" })); // ✅ Increased for base64 files
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Backend server is running!",
    status: "✅ OK",
    timestamp: new Date().toISOString(),
  });
});

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/media", mediaRoutes); // ✅ NEW
app.use("/api/branding", brandingRoutes); // ✅ NEW

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
