import express from "express";
import { registerProduct, getProductId, getAllProducts, deleateProduct, updateProfile } from "../controllers/productController.js"
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(registerProduct);
router.route("/getall").get(getAllProducts);

// Standard RESTful ID routes
router.route("/:id")
  .get(getProductId)
  .put(updateProfile)
  .delete(deleateProduct);

// Legacy and convenience aliases
router.route("/get/:id").get(getProductId);
router.route("/update/:id").put(updateProfile);
router.route("/delete/:id").delete(deleateProduct);
router.route("/deleate/:id").delete(deleateProduct);

export default router;