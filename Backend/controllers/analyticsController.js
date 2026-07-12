import Product from "../models/ProductModel.js";
import Customer from "../models/CustomerModel.js";
import Invoice from "../models/InvoicesModel.js";

// Get Overview Stats (Revenues, Products, Customers counts)
export const getOverviewStats = async (req, res) => {
  try {
    const salesAggregation = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: "$InvoiceAmount" } } }
    ]);
    const totalSales = salesAggregation.length > 0 ? salesAggregation[0].total : 0;

    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    return res.status(200).json({
      success: true,
      totalSales,
      totalProducts,
      totalCustomers,
      conversionRate: 12.5
    });
  } catch (err) {
    console.error("Overview Stats Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch overview analytics stats."
    });
  }
};

// Get Monthly Sales Trends (grouped by createdAt month)
export const getSalesTrend = async (req, res) => {
  try {
    const trend = await Invoice.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$InvoiceAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrend = monthNames.map((name, index) => {
      const monthNum = index + 1;
      const match = trend.find(item => item._id === monthNum);
      return {
        name,
        sales: match ? match.sales : 0
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedTrend
    });
  } catch (err) {
    console.error("Sales Trend Stats Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales trends."
    });
  }
};

// Get Product Category Shares for pie charts
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $lookup: {
          from: "productcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$categoryInfo.category",
          value: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = stats.map(item => ({
      name: item._id || "General",
      value: item.value
    }));

    return res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (err) {
    console.error("Category Stats Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category distribution."
    });
  }
};
