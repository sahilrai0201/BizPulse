import Product from "../models/ProductModel.js";
import Customer from "../models/CustomerModel.js";
import Invoice from "../models/InvoicesModel.js";
import ProductCategory from "../models/ProductCategoryModel.js";

/**
 * Seeds a default set of products, customers, and invoices for a specific business user.
 * This gives new users interactive dummy data that is isolated to their business.
 * 
 * @param {string} userId - The ID of the user to seed data for.
 */
export const seedUserData = async (userId) => {
  try {
    console.log(`Checking and seeding default data for user: ${userId}`);

    // 1. Get or create product categories (global)
    let electronics = await ProductCategory.findOne({ category: "Electronics" });
    if (!electronics) {
      electronics = await ProductCategory.create({ category: "Electronics", gstRate: 18 });
    }
    
    let clothing = await ProductCategory.findOne({ category: "Clothing" });
    if (!clothing) {
      clothing = await ProductCategory.create({ category: "Clothing", gstRate: 12 });
    }
    
    let books = await ProductCategory.findOne({ category: "Books" });
    if (!books) {
      books = await ProductCategory.create({ category: "Books", gstRate: 5 });
    }

    // 2. Create products for this user
    const p1 = await Product.create({
      ProductName: "Wireless Earbuds",
      unitOfMeasurement: "pcs",
      quantity: 150,
      cost: 49.99,
      category: electronics._id,
      userId
    });
    const p2 = await Product.create({
      ProductName: "Designer Jeans",
      unitOfMeasurement: "pcs",
      quantity: 80,
      cost: 79.99,
      category: clothing._id,
      userId
    });
    const p3 = await Product.create({
      ProductName: "JS Guide Book",
      unitOfMeasurement: "box",
      quantity: 45,
      cost: 29.99,
      category: books._id,
      userId
    });

    // 3. Create customers for this user
    const c1 = await Customer.create({
      BusinessName: "John Doe Corp",
      email: "john@doecorp.com",
      mobileNumber: 9876543210,
      gstNumber: 271234567890,
      BillingAddress: "123 Business Rd, New York",
      userId
    });
    const c2 = await Customer.create({
      BusinessName: "Jane Smith LLC",
      email: "jane@smithllc.com",
      mobileNumber: 8765432109,
      gstNumber: 279876543210,
      BillingAddress: "456 Commerce St, San Francisco",
      userId
    });

    // 4. Create invoices for this user
    const inv1 = await Invoice.create({
      InvoiceNumber: 1001,
      customerDetails: c1._id,
      productDetails: [
        { product: p1._id, ProductQuantity: 2 },
        { product: p2._id, ProductQuantity: 1 }
      ],
      InvoiceAmount: 179.97,
      DateofIssue: "2026-06-15",
      subTotal: 179.97,
      userId
    });
    const inv2 = await Invoice.create({
      InvoiceNumber: 1002,
      customerDetails: c2._id,
      productDetails: [
        { product: p3._id, ProductQuantity: 10 }
      ],
      InvoiceAmount: 299.90,
      DateofIssue: "2026-07-12",
      subTotal: 299.90,
      userId
    });

    // Distribute dates for invoice charts
    const juneDate = new Date();
    juneDate.setMonth(juneDate.getMonth() - 1); // 1 Month Ago
    await Invoice.findByIdAndUpdate(inv1._id, { $set: { createdAt: juneDate } });

    console.log(`Seeding complete for user: ${userId}`);
  } catch (error) {
    console.error(`Error seeding data for user ${userId}:`, error);
  }
};
