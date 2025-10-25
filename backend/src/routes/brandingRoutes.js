import express from "express";
import {
  getFormBranding,
  updateFormBranding,
  uploadLogo,
} from "../controllers/brandingController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get form branding
router.get("/:formId", getFormBranding);

// Update form branding
router.put("/:formId", authenticateUser, updateFormBranding);

// Upload logo
router.post("/:formId/logo", authenticateUser, uploadSingle, uploadLogo);

export default router;
