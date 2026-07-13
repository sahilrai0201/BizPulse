import express from "express";
import { getOverviewStats, getSalesTrend, getCategoryStats } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/overview").get(getOverviewStats);
router.route("/sales-trend").get(getSalesTrend);
router.route("/categories").get(getCategoryStats);

export default router;
