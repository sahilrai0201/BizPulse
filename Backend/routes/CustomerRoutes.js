import express from "express";
import { registerCustomer, getCustomerId, updateCustomer, deleteCustomer, getAllCustomers } from "../controllers/customerController.js"
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(registerCustomer);
router.route("/getall").get(getAllCustomers);

// Standard RESTful ID routes
router.route("/:id")
  .get(getCustomerId)
  .put(updateCustomer)
  .delete(deleteCustomer);

// Legacy and convenience aliases
router.route("/get/:id").get(getCustomerId);
router.route("/update/:id").put(updateCustomer);
router.route("/delete/:id").delete(deleteCustomer);
router.route("/deleate/:id").delete(deleteCustomer);

export default router;