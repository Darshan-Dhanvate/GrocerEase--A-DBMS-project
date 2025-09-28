// src/pages/Dashboard/Dashboard.jsx
// This is the main component for the Dashboard page.

import React, { useState, useEffect } from 'react';
import KpiCard from './KpiCard.jsx';
import { DollarSign, ListChecks, Package, AlertTriangle } from 'lucide-react';
import * as reportService from '../../services/reportService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const Dashboard = () => {
    // State to hold all dashboard data, loading status, and any errors
    const [dashboardData, setDashboardData] = useState({
        sales: { total_sales: 0, total_bills: 0 },
        lowStock: [],
        expiring: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch data when the component first loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all required reports in parallel for efficiency
                const [sales, lowStock, expiring] = await Promise.all([
                    reportService.getDailySalesReport(),
                    reportService.getLowStockReport(),
                    // --- THE FIX IS HERE ---
                    // Corrected function name from getExpiryAlertReport to getExpiringReport
                    reportService.getExpiringReport(),
                ]);
                setDashboardData({ sales, lowStock, expiring });
                setError(null); // Clear any previous errors
            } catch (err) {
                setError("Failed to fetch dashboard data. Please check the backend connection.");
                console.error(err);
            } finally {
                setLoading(false); // Stop loading, regardless of success or failure
            }
        };

        fetchData();
    }, []); // The empty dependency array [] means this runs only once on mount

    // Conditional rendering based on the loading state
    if (loading) {
        return <div className="text-center text-lg text-gray-600">Loading Dashboard...</div>;
    }

    // Conditional rendering for errors
    if (error) {
        return <div className="text-center text-lg text-red-500 p-8 bg-red-50 rounded-lg">{error}</div>;
    }

    // Main component JSX returned after data is successfully fetched
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                    value={dashboardData.lowStock.length}
                    icon={<Package />}
                    colorClass="text-yellow-600"
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
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
    );
};

export default Dashboard;