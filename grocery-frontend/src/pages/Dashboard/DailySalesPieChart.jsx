// frontend/src/pages/Dashboard/DailySalesPieChart.jsx
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import * as reportService from '../../services/reportService.js';
import { PieChart } from 'lucide-react';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DailySalesPieChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await reportService.getSalesByCategory();
                
                if (data && data.length > 0) {
                    const labels = data.map(item => item.category);
                    const sales = data.map(item => item.total_sales);
                    
                    setChartData({
                        labels: labels,
                        datasets: [{
                            label: 'Sales',
                            data: sales,
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                                'rgba(255, 159, 64, 0.8)',
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        }]
                    });
                } else {
                    setChartData(null); // No data to display
                }

            } catch (err) {
                setError("Could not load category sales data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Today's Sales by Category",
                font: {
                    size: 16
                }
            },
        },
    };

    if (loading) {
        return <div className="text-center p-4">Loading Chart...</div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {chartData ? (
                <Pie data={chartData} options={options} />
            ) : (
                <div className="text-center py-10">
                    <PieChart size={48} className="mx-auto text-gray-300" />
                    <p className="mt-2 text-gray-500">No sales data for today to display.</p>
                </div>
            )}
        </div>
    );
};

export default DailySalesPieChart;