import express from "express";
import { registerUser, loginUser, getUserId, updateUser, deleateUser, logoutUser, getUserProfile } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();



router.route("/").post(registerUser);

router.route("/login").post(loginUser);
router.route("/profile").get(protect, getUserProfile);

// Standard RESTful ID routes
router.route("/:id")
  .get(protect, getUserId)
  .put(protect, updateUser)
  .delete(protect, deleateUser);

// Legacy aliases
router.route("/get/:id").get(protect, getUserId);
router.route("/update/:id").put(protect, updateUser);
router.route("/delete/:id").delete(protect, deleateUser);
router.route("/deleate/:id").delete(protect, deleateUser);
router.route("/logout").delete(logoutUser);


export default router;