import express from "express";

import {
    registerUser,
    loginUser,
    getUserProfile,
    updatedUserProfile,
} from "../controllers/authController.js";
import {upload} from '../middleware/uploadMiddleware.js'

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updatedUserProfile);

router.post("/upload-image", upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No File Uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});



export default router;
