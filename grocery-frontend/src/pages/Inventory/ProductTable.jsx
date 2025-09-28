// src/pages/Inventory/ProductTable.jsx
// This component is responsible for displaying the list of products in a table.

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.product_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{product.product_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${product.quantity_in_stock} ${product.unit}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(product.selling_price)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(product.expiry_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => onEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    aria-label={`Edit ${product.product_name}`}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(product.product_id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    aria-label={`Delete ${product.product_name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
