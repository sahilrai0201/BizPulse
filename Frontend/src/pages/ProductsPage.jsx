import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, IndianRupee, Package, TrendingUp } from "lucide-react";
import ProductsTable from "../components/products/ProductsTable";

const ProductsPage = () => {
	const [products, setProducts] = useState([]);
	const [refreshTrigger, setRefreshTrigger] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/product/getall`);
				if (response.status === 200) {
					setProducts(response.data.data);
				}
			} catch (err) {
				console.error("Error fetching products:", err);
			}
		};
		fetchProducts();
	}, [refreshTrigger]);

	const totalProducts = products.length;
	const lowStockCount = products.filter(p => p.quantity < 10).length;
	const totalInventoryValue = products.reduce((sum, p) => sum + (p.cost * p.quantity), 0);

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Products' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Products' icon={Package} value={totalProducts} color='#6366F1' />
					<StatCard name='Top Selling' icon={TrendingUp} value={totalProducts > 0 ? "Wireless Earbuds" : "N/A"} color='#10B981' />
					<StatCard name='Low Stock' icon={AlertTriangle} value={lowStockCount} color='#F59E0B' />
					<StatCard name='Inventory Value' icon={IndianRupee} value={`₹${totalInventoryValue.toLocaleString()}`} color='#EF4444' />
				</motion.div>

				<ProductsTable products={products} onRefresh={() => setRefreshTrigger(prev => !prev)} />
			</main>
		</div>
	);
};
export default ProductsPage;
