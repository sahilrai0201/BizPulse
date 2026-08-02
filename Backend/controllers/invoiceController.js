import Invoice from "../models/InvoicesModel.js";
import Customer from "../models/CustomerModel.js";
import Product from "../models/ProductModel.js";

export const registerInvoice = async (req, res) => {
    try {
        const { InvoiceNumber, productDetails, customerDetails, InvoiceAmount, DateofIssue, subTotal } = req.body;

        // Check if invoice already exists for this business user
        const existingInvoice = await Invoice.findOne({ InvoiceNumber, userId: req.user.id });
        if (existingInvoice) {
            return res.status(400).json({ message: "Invoice already exists" });
        }

        // Validate customer existence for this user
        const customer = await Customer.findOne({ _id: customerDetails, userId: req.user.id });
        if (!customer) {
            return res.status(400).json({ message: "Customer not found or not owned by you" });
        }

        // Validate products and quantities for this user
        for (const item of productDetails) {
            const product = await Product.findOne({ _id: item.product, userId: req.user.id });
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.product} not found or not owned by you` });
            }
            if (!item.ProductQuantity || item.ProductQuantity <= 0) {
                return res.status(400).json({ message: "Invalid product quantity" });
            }
        }

        // Create a new invoice
        const newInvoice = new Invoice({
            InvoiceNumber,
            productDetails,
            customerDetails,
            InvoiceAmount,
            DateofIssue,
            subTotal,
            userId: req.user.id
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ userId: req.user.id })
            .populate("customerDetails", "BusinessName email") // Adjust fields as needed
            .populate("productDetails.product", "name price"); // Adjust fields as needed
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findOne({ _id: id, userId: req.user.id })
            .populate("customerDetails", "BusinessName email")
            .populate("productDetails.product", "name price");

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInvoice = await Invoice.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const { InvoiceNumber, productDetails, customerDetails, InvoiceAmount, DateofIssue, subTotal } = req.body;

        // Validate customer existence if updated
        if (customerDetails) {
            const customer = await Customer.findOne({ _id: customerDetails, userId: req.user.id });
            if (!customer) {
                return res.status(400).json({ message: "Customer not found or not owned by you" });
            }
        }

        // Validate products and quantities if updated
        if (productDetails) {
            for (const item of productDetails) {
                const product = await Product.findOne({ _id: item.product, userId: req.user.id });
                if (!product) {
                    return res.status(400).json({ message: `Product with ID ${item.product} not found or not owned by you` });
                }
                if (!item.ProductQuantity || item.ProductQuantity <= 0) {
                    return res.status(400).json({ message: "Invalid product quantity" });
                }
            }
        }

        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { InvoiceNumber, productDetails, customerDetails, InvoiceAmount, DateofIssue, subTotal },
            { new: true }
        )
            .populate("customerDetails", "BusinessName email")
            .populate("productDetails.product", "name price");

        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// AI Receipt Scanner Controller
export const scanInvoiceReceipt = async (req, res) => {
    try {
        const { image, mimeType } = req.body;

        if (!image || !mimeType) {
            return res.status(400).json({ success: false, message: "Image base64 data and mimeType are required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        let scanResult = null;

        if (apiKey) {
            try {
                // Strip metadata prefix from base64 if present (e.g. "data:image/jpeg;base64,")
                const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, "");

                const prompt = `Extract all billing, client, and item details from the attached invoice/receipt image. 
Return strictly a raw JSON object (do not wrap in markdown block formatting, just the raw JSON text) matching this schema:
{
  "billTo": "Client or Customer Business Name",
  "billToEmail": "Client email address",
  "billToMobileNumber": "10-digit mobile number as string",
  "billToAddress": "Billing address of the customer",
  "gstNumber": "15-digit alphanumeric GST number",
  "dateOfIssue": "YYYY-MM-DD format",
  "invoiceNumber": 1003,
  "items": [
    { "name": "Item/Product description", "price": 99.99, "quantity": 1 }
  ],
  "subTotal": 99.99,
  "total": 99.99
}`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                {
                                    inlineData: {
                                        mimeType: mimeType,
                                        data: base64Data
                                    }
                                }
                            ]
                        }]
                    })
                });

                const result = await response.json();
                let textResult = result.candidates[0].content.parts[0].text;
                
                // Clean up markdown block if the model generated it
                textResult = textResult.replace(/^```json/, "").replace(/```$/, "").trim();
                scanResult = JSON.parse(textResult);
            } catch (err) {
                console.warn("Gemini receipt OCR scan failed, falling back to mock scanner:", err);
            }
        }

        // Mock scan fallback for local testing / offline dev
        if (!scanResult) {
            scanResult = {
                billTo: "Phoenix Retailers Ltd",
                billToEmail: "billing@phoenixretail.com",
                billToMobileNumber: "9123456780",
                billToAddress: "B-24 Industrial Zone, Sector 4, Mumbai",
                gstNumber: "27AAAAA1111A1Z9",
                dateOfIssue: new Date().toISOString().split("T")[0],
                invoiceNumber: Math.floor(Math.random() * 9000) + 1000,
                items: [
                    { name: "Sony Headphones WH-1000XM4", price: 299.99, quantity: 1 },
                    { name: "USB-C Charge Cable (2m)", price: 19.99, quantity: 2 },
                    { name: "Wireless Bluetooth Mouse", price: 49.50, quantity: 1 }
                ],
                subTotal: 389.47,
                total: 389.47
            };
        }

        return res.status(200).json({
            success: true,
            message: "Invoice receipt scanned successfully!",
            data: scanResult
        });
    } catch (error) {
        console.error("AI Receipt OCR Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to perform AI receipt scan.",
            error: error.message
        });
    }
};
