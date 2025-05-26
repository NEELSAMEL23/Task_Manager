import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js"
import { getUser, getUserById } from "../controllers/userController.js"

const router = express.Router();


router.get("/", protect, adminOnly, getUser);
router.get("/:id", protect, getUserById);


export default router;
