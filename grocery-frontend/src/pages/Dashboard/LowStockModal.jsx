// frontend/src/pages/Dashboard/LowStockModal.jsx
import React from 'react';
// --- THIS LINE IS CORRECTED ---
// Replaced the non-existent 'PackageWarning' with the valid 'Archive' icon.
import { X, Archive } from 'lucide-react';

const LowStockModal = ({ items, onClose }) => {
    if (!items) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-yellow-700 flex items-center">
                        {/* --- THIS LINE IS CORRECTED --- */}
                        <Archive className="mr-2" />
                        Low Stock Items
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Left</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.length > 0 ? (
                                items.map(item => (
                                    <tr key={item.product_id} className="text-sm">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{item.product_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.brand || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-yellow-700">{item.quantity_in_stock}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">
                                        No items are currently low on stock.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LowStockModal;