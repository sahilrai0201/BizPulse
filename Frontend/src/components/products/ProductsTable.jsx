import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


const ProductsTable = ({ products = [], onRefresh }) => {

    const [ProductName, setProductName] = useState('');
    const [unitOfMeasurement, setunitOfMeasurement] = useState('pcs');
    const [quantity, setquantity] = useState(0);
    const [cost, setcost] = useState(0);
    const [category, setcategory] = useState(0);

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState(null);
    const [editProductName, setEditProductName] = useState('');
    const [editUnitOfMeasurement, setEditUnitOfMeasurement] = useState('pcs');
    const [editQuantity, setEditQuantity] = useState(0);
    const [editCost, setEditCost] = useState(0);

    const handleDelete = async (productId) => {
        try {
            if (window.confirm("Are you sure you want to delete this product?")) {
                const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/product/deleate/${productId}`);
                if (response.status === 200) {
                    if (onRefresh) onRefresh();
                }
            }
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditProductName(product.ProductName || '');
        setEditCost(product.cost || 0);
        setEditUnitOfMeasurement(product.unitOfMeasurement || 'pcs');
        setEditQuantity(product.quantity || 0);
    };

    const handleUpdateProduct = async () => {
        try {
            const updatedProductData = {
                ProductName: editProductName,
                cost: Number(editCost),
                quantity: Number(editQuantity),
                unitOfMeasurement: editUnitOfMeasurement
            };
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/product/update/${editingProduct._id}`, updatedProductData);
            if (response.status === 200) {
                if (onRefresh) onRefresh();
                setEditingProduct(null);
            }
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };


    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleAddProductToggle = () => {
        setIsAddingProduct(!isAddingProduct);
    };

    const handleAddProduct = async () => {

        const newProductData = {
            ProductName: ProductName,
            cost: cost,
            quantity: quantity,
            unitOfMeasurement: unitOfMeasurement,
            category: category
        };
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/product`, newProductData);

        if (response.status == 201) {
            if (onRefresh) onRefresh();
            navigate('/products');
        }

        setProductName('');
        setcost('');
        setquantity('');
        setunitOfMeasurement('');
        setcategory('');
        setIsAddingProduct(false);
    }

    // Filter products based on the search term
    const filteredProducts = products.filter((product) => {
        const categoryName = typeof product.category === 'object' && product.category
            ? product.category.category
            : String(product.category || '');
        
        return (
            (product.ProductName && product.ProductName.toLowerCase().includes(searchTerm)) ||
            categoryName.toLowerCase().includes(searchTerm)
        );
    });
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    {/* Add Product Button */}
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
                        onClick={handleAddProductToggle}
                    >
                        Add Product
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearch}
                        value={searchTerm}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* Add Product Form */}
            {isAddingProduct && (
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">Add New Product</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                            name="name"
                            value={ProductName}
                            onChange={(e) => {
                                setProductName(e.target.value)
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                            name="category"
                            value={category}
                            onChange={(e) => {
                                setcategory(e.target.value)
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                            name="cost"
                            value={cost}
                            onChange={(e) => {
                                setcost(e.target.value)
                            }}
                        />
                        <select
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                            name="unitOfMeasurement"
                            value={unitOfMeasurement}
                            onChange={(e) => {
                                setunitOfMeasurement(e.target.value)
                            }}
                        >
                            <option value="pcs">pcs</option>
                            <option value="box">box</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Quantity"
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => {
                                setquantity(e.target.value)
                            }}
                        />
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                            onClick={handleAddProduct}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Product Form */}
            {editingProduct && (
                <div className="bg-gray-700 p-4 rounded-lg mb-4 text-left">
                    <h3 className="text-lg font-semibold text-gray-100">Edit Product</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                            <input
                                type="text"
                                placeholder="Product Name"
                                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                                value={editProductName}
                                onChange={(e) => setEditProductName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                            <input
                                type="number"
                                placeholder="Price"
                                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                                value={editCost}
                                onChange={(e) => setEditCost(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Unit of Measurement</label>
                            <select
                                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                                value={editUnitOfMeasurement}
                                onChange={(e) => setEditUnitOfMeasurement(e.target.value)}
                            >
                                <option value="pcs">pcs</option>
                                <option value="box">box</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                placeholder="Quantity"
                                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                                onClick={handleUpdateProduct}
                            >
                                Save Changes
                            </button>
                            <button
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                onClick={() => setEditingProduct(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                unit Of Measurement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {filteredProducts.map((product,index) => (
                            <motion.tr
                                key={product.id||index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
                                        alt="Product img"
                                        className="size-10 rounded-full"
                                    />
                                    {product.ProductName}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {typeof product.category === 'object' && product.category
                                        ? product.category.category
                                        : product.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.unitOfMeasurement}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    ${(product.cost || 0).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <span className={product.quantity < 10 ? "text-red-400 font-bold flex items-center gap-2" : ""}>
                                        {product.quantity}
                                        {product.quantity < 10 && (
                                            <span className="text-[10px] bg-red-900 bg-opacity-40 text-red-300 border border-red-800 px-2 py-0.5 rounded-full font-medium">
                                                Low Stock
                                            </span>
                                        )}
                                    </span>
                                </td>                        
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <button
                                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                                    onClick={() => handleEdit(product)}
                                    >
                                    <Edit size={18} />
                                    </button>
                                    <button
                                    className="text-red-400 hover:text-red-300"
                                    onClick={() => handleDelete(product._id)}
                                    >
                                    <Trash2 size={18} />
                                    </button>
                                    </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ProductsTable;
