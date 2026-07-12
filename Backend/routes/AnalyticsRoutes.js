import express from "express";
import { getOverviewStats, getSalesTrend, getCategoryStats } from "../controllers/analyticsController.js";

const router = express.Router();

router.route("/overview").get(getOverviewStats);
router.route("/sales-trend").get(getSalesTrend);
router.route("/categories").get(getCategoryStats);

export default router;
