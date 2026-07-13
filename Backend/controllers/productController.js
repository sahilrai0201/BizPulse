import Product from "../models/ProductModel.js";
import ProductCategory from "../models/ProductCategoryModel.js";

export const registerProduct = async (req, res) => {
    try {
        const { ProductName, unitOfMeasurement, quantity, cost, category } = req.body;
        if (!ProductName || !unitOfMeasurement || !quantity || !cost) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const existingProduct = await Product.findOne({ ProductName, userId: req.user.id });
        if (existingProduct) {
            return res.status(400).json({
                message: "Product with this name already exists for your business",
                success: false,
            });
        }

        let categoryId = null;
        if (category) {
            let catObj = null;
            if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
                catObj = await ProductCategory.findById(category);
            } else if (typeof category === 'string') {
                catObj = await ProductCategory.findOne({ category: new RegExp(`^${category.trim()}$`, 'i') });
            }

            if (catObj) {
                categoryId = catObj._id;
            } else if (typeof category === 'string' && category.trim()) {
                const newCat = await ProductCategory.create({ category: category.trim(), gstRate: 18 });
                categoryId = newCat._id;
            }
        }

        const newProduct = new Product({
            ProductName,
            unitOfMeasurement,
            quantity,
            cost,
            category: categoryId,
            userId: req.user.id
        });

        // Save the product to the database
        await newProduct.save();

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product: newProduct,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}

export const getProductId = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ _id: productId, userId: req.user.id }).populate("category");
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        return res.status(200).json({
            product,
            success: true
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user.id }).populate("category");

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            data: products
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const deleateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOneAndDelete({ _id: productId, userId: req.user.id });
        if (!product) {
            return res.status(400).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product Deleated!!",
            success: true
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { ProductName, unitOfMeasurement, quantity, cost, category } = req.body;
        const productId = req.params.id;
        let product = await Product.findOne({ _id: productId, userId: req.user.id });
        if (!product) {
            return res.status(400).json({
                message: "Product not found",
                success: false
            });
        }

        if (ProductName) product.ProductName = ProductName;
        if (cost !== undefined) product.cost = cost;
        if (unitOfMeasurement) product.unitOfMeasurement = unitOfMeasurement;
        if (quantity !== undefined) product.quantity = quantity;

        if (category) {
            let categoryId = null;
            let catObj = null;
            if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
                catObj = await ProductCategory.findById(category);
            } else if (typeof category === 'string') {
                catObj = await ProductCategory.findOne({ category: new RegExp(`^${category.trim()}$`, 'i') });
            }

            if (catObj) {
                categoryId = catObj._id;
            } else if (typeof category === 'string' && category.trim()) {
                const newCat = await ProductCategory.create({ category: category.trim(), gstRate: 18 });
                categoryId = newCat._id;
            }
            product.category = categoryId;
        }

        await product.save();

        product = {
            _id: product._id,
            ProductName: product.ProductName,
            cost: product.cost,
            unitOfMeasurement: product.unitOfMeasurement,
            quantity: product.quantity,
            category: product.category,
        }

        return res.status(200).json({
            message: `Profile updated successfully`,
            product,
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}
