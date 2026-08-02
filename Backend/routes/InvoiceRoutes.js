import express from "express";
import { registerInvoice, getAllInvoices, getInvoiceById, deleteInvoiceById, updateInvoiceById, scanInvoiceReceipt } from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/register", registerInvoice);
router.post("/scan", scanInvoiceReceipt);
router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.delete("/:id", deleteInvoiceById);
router.put("/:id", updateInvoiceById);

export default router;
