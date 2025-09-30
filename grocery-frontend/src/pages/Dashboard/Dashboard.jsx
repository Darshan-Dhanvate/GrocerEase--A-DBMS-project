// frontend/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import KpiCard from './KpiCard.jsx';
import DailySalesPieChart from './DailySalesPieChart.jsx'; // <-- IMPORT the new chart component
import { DollarSign, ListChecks, Package, AlertTriangle } from 'lucide-react';
import * as reportService from '../../services/reportService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        sales: { total_sales: 0, total_bills: 0 },
        lowStockCount: 0,
        expiring: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all data in parallel
                const [sales, lowStock, expiring] = await Promise.all([
                    reportService.getDailySalesReport(),
                    reportService.getLowStockReport(),
                    reportService.getExpiringReport(),
                ]);
                // We update the state with the length of the lowStock array for the KPI card
                setDashboardData({ sales, lowStockCount: lowStock.length, expiring });
                setError(null);
            } catch (err) {
                setError("Failed to fetch dashboard data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center text-lg text-gray-600">Loading Dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-lg text-red-500 p-8 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
            
            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KpiCard 
                    title="Today's Sales" 
                    value={formatCurrency(dashboardData.sales.total_sales)} 
                    icon={<DollarSign />}
                    colorClass="text-green-600"
                />
                <KpiCard 
                    title="Today's Bills" 
                    value={dashboardData.sales.total_bills}
                    icon={<ListChecks />}
                    colorClass="text-blue-600"
                />
                <KpiCard 
                    title="Low Stock Items" 
                    value={dashboardData.lowStockCount}
                    icon={<Package />}
                    colorClass="text-yellow-600"
                />
            </div>
            
            {/* New section for charts and lists, organized in a grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* --- THIS IS THE NEW PART --- */}
                {/* Pie chart takes up 2 of 5 columns on large screens */}
                <div className="lg:col-span-2">
                    <DailySalesPieChart />
                </div>

                {/* Expiring Soon list takes up 3 of 5 columns on large screens */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center">
                        <AlertTriangle className="mr-2" />
                        Expiring Soon (Next 30 Days)
                    </h3>
                    <div className="max-h-64 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashboardData.expiring.length > 0 ? (
                                    dashboardData.expiring.map(item => (
                                        <tr key={item.product_id} className="text-sm hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.product_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.quantity_in_stock}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.expiry_date)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" className="text-center py-4 text-gray-500">No items expiring soon.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;