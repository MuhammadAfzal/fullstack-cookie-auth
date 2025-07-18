import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/jwtMiddleware";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "../controllers/profileController";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Profile routes
router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);
router.post("/avatar", requireAuth, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", requireAuth, deleteAvatar);

export default router;
