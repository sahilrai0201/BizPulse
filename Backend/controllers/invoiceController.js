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
