import express from "express";
import { register, updateProductCategory, deleteProduct } from "../controllers/productCategoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(register);
router.route("/update/:id").patch(updateProductCategory);
router.route("/delete/:id").delete(deleteProduct);

export default router;