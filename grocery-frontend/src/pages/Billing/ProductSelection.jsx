// src/pages/Billing/ProductSelection.jsx
// This component displays a searchable list of products that can be added to the bill.

import React, { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

const ProductSelection = ({ products, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // useMemo is used for optimization. It only recalculates the filtered list 
    // when the products list or the search term changes, not on every re-render.
    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products.filter(p => p.quantity_in_stock > 0);
        }
        return products.filter(p =>
            p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) && p.quantity_in_stock > 0
        );
    }, [products, searchTerm]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Select Products</h3>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name..."
                className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <div className="h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <tr key={product.product_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{product.product_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.quantity_in_stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(product.selling_price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onAddToCart(product.product_id)}
                                            className="text-green-600 hover:text-green-800 transition-colors"
                                            aria-label={`Add ${product.product_name} to cart`}
                                        >
                                            <PlusCircle size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No products match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductSelection;