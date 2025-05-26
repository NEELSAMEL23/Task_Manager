import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js"
import { exportTaskReport, exportUserReport } from "../controllers/reportController.js"

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTaskReport)
router.get("/export/users", protect, adminOnly, exportUserReport)

export default router;