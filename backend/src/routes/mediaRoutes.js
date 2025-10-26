// ============================================
// 📦 backend/src/routes/mediaRoutes.js
// Routes for media uploads
// ============================================
import express from "express";
import {
  uploadFormMedia,
  getFormMedia,
  deleteFormMedia,
} from "../controllers/mediaController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload media to form
router.post("/:formId/upload", authenticateUser, uploadSingle, uploadFormMedia);

// Get all media for a form
router.get("/:formId", getFormMedia);

// Delete media
router.delete("/:mediaId", authenticateUser, deleteFormMedia);

export default router;
