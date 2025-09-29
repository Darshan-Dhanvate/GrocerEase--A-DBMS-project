// frontend/src/pages/Recommender/Recommender.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BarChart, Trophy } from 'lucide-react';
import * as reportService from '../../services/reportService.js';

const Recommender = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State to manage the selected time period, defaulting to '7days'
    const [period, setPeriod] = useState('7days');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await reportService.getTopSellingProducts(period);
            setTopProducts(data);
        } catch (err) {
            setError("Failed to fetch top-selling products report.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [period]); // This function re-runs whenever the 'period' state changes

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getPeriodText = () => {
        if (period === '7days') return 'Last 7 Days';
        if (period === '30days') return 'Last 30 Days';
        return 'All Time';
    };
    
    const getButtonClass = (buttonPeriod) => {
        return period === buttonPeriod
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100';
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <TrendingUp className="mr-3" size={32} />
                Product Recommender
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-700">
                        Top 10 Best-Sellers: <span className="text-blue-600">{getPeriodText()}</span>
                    </h2>
                    {/* Time Period Filter Buttons */}
                    <div className="flex space-x-2">
                        <button onClick={() => setPeriod('7days')} className={`px-4 py-2 rounded-md text-sm font-medium ${getButtonClass('7days')}`}>7 Days</button>
                        <button onClick={() => setPeriod('30days')} className={`px-4 py-2 rounded-md text-sm font-medium ${getButtonClass('30days')}`}>30 Days</button>
                        <button onClick={() => setPeriod('alltime')} className={`px-4 py-2 rounded-md text-sm font-medium ${getButtonClass('alltime')}`}>All Time</button>
                    </div>
                </div>

                {loading && <div className="text-center py-4">Loading report...</div>}
                {error && <div className="text-red-500 py-4 text-center">{error}</div>}
                
                {!loading && !error && (
                    <div className="space-y-4">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                                        {index === 0 ? <Trophy size={24} /> : `#${index + 1}`}
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <p className="font-bold text-gray-800">{product.product_name}</p>
                                        <p className="text-sm text-gray-500">{product.brand || 'No Brand'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">{product.total_quantity_sold}</p>
                                        <p className="text-xs text-gray-500">units sold</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <BarChart size={48} className="mx-auto text-gray-300" />
                                <p className="mt-2 text-gray-500">No sales data available for this period.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommender;