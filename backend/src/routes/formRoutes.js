// ============================================
// 📦 backend/src/routes/formRoutes.js
// UPDATED - Use new question handler
// ============================================
import express from "express";
import {
  createForm,
  getUserForms,
  getFormById,
  updateForm,
  deleteForm,
  addQuestion, // ✅ Updated
  updateQuestion,
  deleteQuestion,
} from "../controllers/formController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Form routes (protected)
router.post("/", authenticateUser, createForm);
router.get("/", authenticateUser, getUserForms);
router.get("/:formId", getFormById); // Public if form is public
router.put("/:formId", authenticateUser, updateForm);
router.delete("/:formId", authenticateUser, deleteForm);

// Question routes (protected) - ✅ Updated to use new handler
router.post("/:formId/questions", authenticateUser, addQuestion);
router.put("/questions/:questionId", authenticateUser, updateQuestion);
router.delete("/questions/:questionId", authenticateUser, deleteQuestion);

export default router;
