import express from "express";
import { registerCustomer, getCustomerId, updateCustomer, deleteCustomer, getAllCustomers } from "../controllers/customerController.js"
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(registerCustomer);
router.route("/getall").get(getAllCustomers);
router.route("/get/:id").get(getCustomerId);
router.route("/update/:id").put(updateCustomer);
router.route("/deleate/:id").delete(deleteCustomer);


export default router;