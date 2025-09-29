// frontend/src/pages/History/History.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Search } from 'lucide-react';
import * as billingService from '../../services/billingService.js';
import { formatCurrency } from '../../utils/formatters.js';
import ReceiptModal from '../Billing/ReceiptModal.jsx';

const History = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    
    // --- NEW: Two separate states for search terms ---
    const [searchById, setSearchById] = useState('');
    const [searchByName, setSearchByName] = useState('');

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

    // --- MODIFIED: useMemo now handles both search filters ---
    const filteredBills = useMemo(() => {
        return bills.filter(bill => {
            const billIdMatch = String(bill.bill_id).includes(searchById);
            // Handle cases where customer_name might be null
            const customerNameMatch = bill.customer_name 
                ? bill.customer_name.toLowerCase().includes(searchByName.toLowerCase()) 
                : searchByName === ''; // If searching for empty, null names should match
            
            return billIdMatch && customerNameMatch;
        });
    }, [bills, searchById, searchByName]);

    if (loading) return <div>Loading Transaction History...</div>;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction History</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* --- NEW: Search Bar container --- */}
                <div className="flex space-x-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            value={searchById}
                            onChange={(e) => setSearchById(e.target.value)}
                            placeholder="Search by Bill ID..."
                            className="w-full p-2 pl-10 border rounded-md"
                        />
                    </div>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            value={searchByName}
                            onChange={(e) => setSearchByName(e.target.value)}
                            placeholder="Search by Customer Name..."
                            className="w-full p-2 pl-10 border rounded-md"
                        />
                    </div>
                </div>

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
                            {filteredBills.length > 0 ? (
                                filteredBills.map(bill => (
                                    <tr key={bill.bill_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">#{bill.bill_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(bill.bill_date).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{bill.customer_name || 'Walk-in Customer'}</td>
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No transactions found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
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