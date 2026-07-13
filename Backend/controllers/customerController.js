import Customer from "../models/CustomerModel.js";

// Register a new customer
export const registerCustomer = async (req, res) => {
    try {
        const { BusinessName, email, mobileNumber, gstNumber, BillingAddress } = req.body;

        // Check if customer already exists for this business user
        const existingCustomer = await Customer.findOne({ email, userId: req.user.id });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists for your business" });
        }

        // Create a new customer
        const newCustomer = new Customer({
            BusinessName,
            email,
            mobileNumber,
            gstNumber,
            BillingAddress,
            userId: req.user.id
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get customer by ID
export const getCustomerId = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.id });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update customer by ID
export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            updates,
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete customer by ID
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user.id }); // Retrieve user's customers
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
