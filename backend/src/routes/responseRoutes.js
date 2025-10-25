// ============================================
// 📦 backend/src/routes/responseRoutes.js
// UPDATED - Use new response handler
// ============================================
import express from "express";
import {
  submitResponse, // ✅ Updated
  getFormResponses,
  getResponseById,
  deleteResponse,
} from "../controllers/responseController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - submit response (✅ Updated)
router.post("/:formId/submit", submitResponse);

// Protected routes - view/manage responses
router.get("/:formId", authenticateUser, getFormResponses);
router.get("/single/:responseId", authenticateUser, getResponseById);
router.delete("/:responseId", authenticateUser, deleteResponse);

export default router;
