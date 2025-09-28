// src/pages/Billing/ReceiptModal.jsx
// This component displays the final bill details in a modal for printing.

import React from 'react';
import { X, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const ReceiptModal = ({ billDetails, onClose }) => {
    if (!billDetails) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-sm">
                {/* This inner div is what will be targeted for printing */}
                <div id="receipt-content" className="text-sm printable-area">
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold">GrocerEase</h2>
                        <p className="text-xs">123 Market St, Pune, Maharashtra</p>
                    </div>
                    <hr className="my-3 border-dashed" />
                    <div className="flex justify-between">
                        <span>Bill ID:</span>
                        <strong>{billDetails.bill_id}</strong>
                    </div>
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date(billDetails.bill_date).toLocaleString()}</span>
                    </div>
                    <hr className="my-3 border-dashed" />
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left font-semibold">Item</th>
                                <th className="text-center font-semibold">Qty</th>
                                <th className="text-right font-semibold">Price</th>
                                <th className="text-right font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billDetails.items.map(item => (
                                <tr key={item.bill_item_id}>
                                    <td>{item.product_name}</td>
                                    <td className="text-center">{item.quantity_sold}</td>
                                    <td className="text-right">{formatCurrency(item.price_per_unit)}</td>
                                    <td className="text-right">{formatCurrency(item.total_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr className="my-3 border-dashed" />
                    <div className="space-y-1">
                        <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(billDetails.sub_total)}</span></div>
                        <div className="flex justify-between"><span>Discount:</span><span>-{formatCurrency(billDetails.discount_amount)}</span></div>
                        <div className="flex justify-between"><span>Tax:</span><span>+{formatCurrency(billDetails.tax_amount)}</span></div>
                        <div className="flex justify-between font-bold text-lg mt-1"><span>Total:</span><span>{formatCurrency(billDetails.net_amount)}</span></div>
                    </div>
                    <hr className="my-3 border-dashed" />
                    <p className="text-center text-xs mt-4">Thank you for your business!</p>
                </div>

                {/* Action buttons (won't be printed) */}
                <div className="flex justify-end mt-6 space-x-4 no-print">
                    <button onClick={handlePrint} className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                        <Printer size={18} className="mr-2" />
                        Print
                    </button>
                    <button onClick={onClose} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                         <X size={18} className="mr-2" />
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;