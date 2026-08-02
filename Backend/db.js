import mongoose from "mongoose";
import dns from "dns";
import { MongoMemoryServer } from "mongodb-memory-server";

// Import Models for Seeding
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";
import Product from "./models/ProductModel.js";
import { seedUserData } from "./utils/seeder.js";

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

    // 2. Check if this demo user has seeded data
    const productsCount = await Product.countDocuments({ userId: demoUser._id });
    if (productsCount === 0) {
      await seedUserData(demoUser._id);
      console.log("Demo user data seeded successfully.");
    }

    console.log("Database seed check complete.");
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
