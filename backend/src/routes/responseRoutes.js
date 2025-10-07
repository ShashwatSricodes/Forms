// backend/src/routes/responseRoutes.js
import express from "express";
import {
  submitResponse,
  getFormResponses,
  getResponseById,
  deleteResponse,
} from "../controllers/responseController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - submit response
router.post("/:formId/submit", submitResponse);

// Protected routes - view/manage responses
router.get("/:formId", authenticateUser, getFormResponses);
router.get("/single/:responseId", authenticateUser, getResponseById);
router.delete("/:responseId", authenticateUser, deleteResponse);

export default router;
