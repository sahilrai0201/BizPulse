import React, { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";

const OverviewPage = () => {
	const [stats, setStats] = useState({
		totalSales: 0,
		totalProducts: 0,
		totalCustomers: 0,
		conversionRate: 12.5
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/analytics/overview`);
				if (response.status === 200) {
					setStats({
						totalSales: response.data.totalSales,
						totalProducts: response.data.totalProducts,
						totalCustomers: response.data.totalCustomers,
						conversionRate: response.data.conversionRate
					});
				}
			} catch (err) {
				console.error("Error fetching overview analytics:", err);
			}
		};
		fetchStats();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Overview' />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Sales' icon={Zap} value={`$${(stats.totalSales || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} color='#6366F1' />
					<StatCard name='Total Customers' icon={Users} value={stats.totalCustomers.toString()} color='#8B5CF6' />
					<StatCard name='Total Products' icon={ShoppingBag} value={stats.totalProducts.toString()} color='#EC4899' />
					<StatCard name='Conversion Rate' icon={BarChart2} value={`${stats.conversionRate}%`} color='#10B981' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
