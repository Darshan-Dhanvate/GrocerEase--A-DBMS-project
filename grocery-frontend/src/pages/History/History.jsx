// frontend/src/pages/History/History.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Eye } from 'lucide-react';
import * as billingService from '../../services/billingService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import ReceiptModal from '../Billing/ReceiptModal.jsx'; // Reusing our existing component!

const History = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const data = await billingService.getAllBills();
                setBills(data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch transaction history.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleViewDetails = async (billId) => {
        try {
            const billDetails = await billingService.getBillById(billId);
            setSelectedBill(billDetails);
        } catch (err) {
            alert("Failed to fetch bill details.");
        }
    };

    // useMemo for efficient searching without re-fetching data
    const filteredBills = useMemo(() => {
        if (!searchTerm) {
            return bills;
        }
        return bills.filter(bill => 
            String(bill.bill_id).includes(searchTerm)
        );
    }, [bills, searchTerm]);

    if (loading) return <div>Loading Transaction History...</div>;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction History</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Bill ID..."
                    className="w-full max-w-xs p-2 border rounded-md mb-4"
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBills.map(bill => (
                                <tr key={bill.bill_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">#{bill.bill_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(bill.bill_date).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{bill.customer_name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold">{formatCurrency(bill.net_amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleViewDetails(bill.bill_id)}
                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                        >
                                            <Eye size={18} className="mr-1" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* The modal will appear when a bill is selected */}
            {selectedBill && (
                <ReceiptModal 
                    billDetails={selectedBill}
                    onClose={() => setSelectedBill(null)}
                />
            )}
        </div>
    );
};

export default History;