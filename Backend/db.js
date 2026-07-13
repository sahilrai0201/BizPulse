import mongoose from "mongoose";
import dns from "dns";
import { MongoMemoryServer } from "mongodb-memory-server";

// Import Models for Seeding
import ProductCategory from "./models/ProductCategoryModel.js";
import Product from "./models/ProductModel.js";
import Customer from "./models/CustomerModel.js";
import Invoice from "./models/InvoicesModel.js";
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";

// Override DNS servers to Google and Cloudflare to resolve SRV records properly
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

const seedDatabase = async () => {
  try {
    console.log("Checking database seeds...");

    // 1. Seed default user if not exists
    let demoUser = await User.findOne({ email: "demo@bizz.com" });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash("demo1234", 10);
      demoUser = await User.create({
        BusinessName: "Demo Corp",
        email: "demo@bizz.com",
        password: hashedPassword,
        mobileNumber: 9999999999,
        gstNumber: 1234567890
      });
      console.log("Demo user 'demo@bizz.com' / 'demo1234' seeded successfully.");
    }

    // 2. Seed product categories
    const categoriesCount = await ProductCategory.countDocuments();
    let electronicsId, clothingId, booksId;
    if (categoriesCount === 0) {
      const eCat = await ProductCategory.create({ category: "Electronics", gstRate: 18 });
      const cCat = await ProductCategory.create({ category: "Clothing", gstRate: 12 });
      const bCat = await ProductCategory.create({ category: "Books", gstRate: 5 });
      electronicsId = eCat._id;
      clothingId = cCat._id;
      booksId = bCat._id;
      console.log("Product categories seeded.");
    } else {
      const cats = await ProductCategory.find();
      electronicsId = cats.find(c => c.category === "Electronics")?._id;
      clothingId = cats.find(c => c.category === "Clothing")?._id;
      booksId = cats.find(c => c.category === "Books")?._id;
    }

    // 3. Seed products
    const productsCount = await Product.countDocuments();
    let earbudId, jeansId, bookId;
    if (productsCount === 0) {
      const p1 = await Product.create({
        ProductName: "Wireless Earbuds",
        unitOfMeasurement: "pcs",
        quantity: 150,
        cost: 49.99,
        category: electronicsId,
        userId: demoUser._id
      });
      const p2 = await Product.create({
        ProductName: "Designer Jeans",
        unitOfMeasurement: "pcs",
        quantity: 80,
        cost: 79.99,
        category: clothingId,
        userId: demoUser._id
      });
      const p3 = await Product.create({
        ProductName: "JS Guide Book",
        unitOfMeasurement: "box",
        quantity: 45,
        cost: 29.99,
        category: booksId,
        userId: demoUser._id
      });
      earbudId = p1._id;
      jeansId = p2._id;
      bookId = p3._id;
      console.log("Inventory products seeded.");
    } else {
      const prods = await Product.find();
      earbudId = prods.find(p => p.ProductName === "Wireless Earbuds")?._id;
      jeansId = prods.find(p => p.ProductName === "Designer Jeans")?._id;
      bookId = prods.find(p => p.ProductName === "JS Guide Book")?._id;
    }

    // 4. Seed customers
    const customersCount = await Customer.countDocuments();
    let johnId, janeId;
    if (customersCount === 0) {
      const c1 = await Customer.create({
        BusinessName: "John Doe Corp",
        email: "john@doecorp.com",
        mobileNumber: 9876543210,
        gstNumber: 271234567890,
        BillingAddress: "123 Business Rd, New York",
        userId: demoUser._id
      });
      const c2 = await Customer.create({
        BusinessName: "Jane Smith LLC",
        email: "jane@smithllc.com",
        mobileNumber: 8765432109,
        gstNumber: 279876543210,
        BillingAddress: "456 Commerce St, San Francisco",
        userId: demoUser._id
      });
      johnId = c1._id;
      janeId = c2._id;
      console.log("Customers seeded.");
    } else {
      const custs = await Customer.find();
      johnId = custs.find(c => c.BusinessName === "John Doe Corp")?._id;
      janeId = custs.find(c => c.BusinessName === "Jane Smith LLC")?._id;
    }

    // 5. Seed invoices
    const invoicesCount = await Invoice.countDocuments();
    if (invoicesCount === 0 && johnId && janeId && earbudId && jeansId && bookId) {
      const inv1 = await Invoice.create({
        InvoiceNumber: 1001,
        customerDetails: johnId,
        productDetails: [
          { product: earbudId, ProductQuantity: 2 },
          { product: jeansId, ProductQuantity: 1 }
        ],
        InvoiceAmount: 179.97,
        DateofIssue: "2026-06-15",
        subTotal: 179.97,
        userId: demoUser._id
      });
      const inv2 = await Invoice.create({
        InvoiceNumber: 1002,
        customerDetails: janeId,
        productDetails: [
          { product: bookId, ProductQuantity: 10 }
        ],
        InvoiceAmount: 299.90,
        DateofIssue: "2026-07-12",
        subTotal: 299.90,
        userId: demoUser._id
      });

      // Distribute months to test the Recharts overview sales trend chart
      const juneDate = new Date();
      juneDate.setMonth(juneDate.getMonth() - 1); // 1 Month Ago (June)
      await Invoice.findByIdAndUpdate(inv1._id, { $set: { createdAt: juneDate } });

      console.log("Invoices seeded with month distribution.");
    }

    console.log("Database seeded successfully.");
  } catch (seedErr) {
    console.error("Database seeding failed:", seedErr);
  }
};

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas at:", process.env.MONGO_URI);
    // Timeout in 3.5 seconds to fall back if blocked/un-whitelisted
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3500
    });
    console.log("mongoDB Atlas is connected successfully!");
    await seedDatabase();
  } catch (err) {
    console.warn("MongoDB Atlas connection failed or timed out. Falling back to local In-Memory database...");
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      console.log("Spun up in-memory DB at:", mongoUri);
      await mongoose.connect(mongoUri);
      console.log("In-memory MongoDB connected successfully!");
      await seedDatabase();
    } catch (memErr) {
      console.error("Critical: Failed to launch local fallback database:", memErr);
    }
  }
};

export default connectDB;
