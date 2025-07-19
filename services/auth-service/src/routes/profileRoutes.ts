import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "../controllers/profileController";
import { requireAuth } from "../middlewares/jwtMiddleware";
import { validate } from "../middlewares/validate";
import { updateProfileSchema } from "../validators/profile";

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  },
});

// All profile routes require authentication
router.use(requireAuth);

router.get("/", getProfile);
router.put("/", validate(updateProfileSchema), updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.delete("/avatar", deleteAvatar);

export default router;
