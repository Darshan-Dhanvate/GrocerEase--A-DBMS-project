// src/pages/Billing/BillSummary.jsx
// This component displays the current bill (cart), calculates totals, and handles bill generation.

import React, { useState, useMemo } from 'react';
import { X, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

const BillSummary = ({ cartItems, onUpdateQuantity, onRemoveItem, onGenerateBill }) => {
    const [discount, setDiscount] = useState(0); // Discount percentage
    const [tax, setTax] = useState(5);         // Tax percentage, default to 5%

    // useMemo optimizes performance by only recalculating totals when dependencies change
    const totals = useMemo(() => {
        const subtotal = cartItems.reduce((acc, item) => acc + (item.selling_price * item.quantity_sold), 0);
        const discountAmount = subtotal * (discount / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (tax / 100);
        const total = taxableAmount + taxAmount;
        return { subtotal, discountAmount, taxAmount, total };
    }, [cartItems, discount, tax]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Current Bill</h3>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto mb-4 pr-2">
                {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">No items added yet.</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={item.product_id} className="flex items-center justify-between py-2 border-b">
                            <div>
                                <p className="font-semibold text-sm">{item.product_name}</p>
                                <p className="text-xs text-gray-600">{formatCurrency(item.selling_price)}</p>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={item.quantity_sold}
                                    min="1"
                                    max={item.max_stock}
                                    onChange={(e) => onUpdateQuantity(item.product_id, parseInt(e.target.value))}
                                    className="w-16 p-1 border rounded-md text-center"
                                />
                                <button
                                    onClick={() => onRemoveItem(item.product_id)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Financial Summary */}
            <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(totals.subtotal)}</span></div>
                <div className="flex items-center justify-between">
                    <label htmlFor="billing-discount" className="text-gray-600">Discount (%):</label>
                    <input type="number" id="billing-discount" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} min="0" max="100" className="w-20 p-1 border rounded-md" />
                </div>
                <div className="flex justify-between"><span>Discount Amt:</span> <span className="text-red-500">-{formatCurrency(totals.discountAmount)}</span></div>
                <div className="flex items-center justify-between">
                    <label htmlFor="billing-tax" className="text-gray-600">Tax (%):</label>
                    <input type="number" id="billing-tax" value={tax} onChange={e => setTax(parseFloat(e.target.value) || 0)} min="0" className="w-20 p-1 border rounded-md" />
                </div>
                <div className="flex justify-between"><span>Tax Amt:</span> <span>+{formatCurrency(totals.taxAmount)}</span></div>
                <div className="flex justify-between font-bold text-xl mt-2 text-gray-800">
                    <span>Total:</span>
                    <span>{formatCurrency(totals.total)}</span>
                </div>
            </div>

            {/* Generate Bill Button */}
            <button
                onClick={() => onGenerateBill(discount, tax)}
                disabled={cartItems.length === 0}
                className="w-full bg-green-600 text-white py-3 rounded-md mt-4 hover:bg-green-700 font-bold flex items-center justify-center disabled:bg-gray-400"
            >
                <Receipt size={20} className="mr-2" />
                Generate Bill
            </button>
        </div>
    );
};

export default BillSummary;