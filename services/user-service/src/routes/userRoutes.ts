import { Router } from "express";
import { userController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { userValidators } from "../validators/userValidators";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/search", userController.searchUsers);
router.get("/:id", userController.getUserById);
router.get("/username/:username", userController.getUserByUsername);

// Protected routes (require authentication)
router.use(authenticateToken);

// User management
router.get("/", userController.getCurrentUser);
router.put("/", validate(userValidators.updateUser), userController.updateUser);
router.delete("/", userController.deleteUser);

// User statistics
router.get("/:id/stats", userController.getUserStats);
router.get("/:id/activities", userController.getUserActivities);

// User preferences
router.get("/:id/preferences", userController.getUserPreferences);
router.put(
  "/:id/preferences",
  validate(userValidators.updatePreferences),
  userController.updateUserPreferences
);

export { router as userRoutes };
