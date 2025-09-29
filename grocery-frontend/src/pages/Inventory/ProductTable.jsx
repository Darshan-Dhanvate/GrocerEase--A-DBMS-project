// frontend/src/pages/Inventory/ProductTable.jsx
import React from 'react';
import { Edit, Trash2, ShieldX } from 'lucide-react'; // ShieldX is for permanent delete
import { formatCurrency, formatDate } from '../../utils/formatters.js';

// The 'view' prop is new and tells the table which set of products it's displaying.
// We also now have onDeactivate and onPermanentDelete functions.
const ProductTable = ({ products, onEdit, onDeactivate, onPermanentDelete, view }) => {
  
  // This helper function determines the status text and row color for each product.
  const getStatusInfo = (product) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date for an accurate comparison
    const expiryDate = product.expiry_date ? new Date(product.expiry_date) : null;

    if (expiryDate && expiryDate < today) {
        return { text: 'Expired', className: 'bg-red-100 text-red-700' };
    }
    if (product.quantity_in_stock <= 0) {
        return { text: 'Out of Stock', className: 'bg-yellow-100 text-yellow-700' };
    }
    if (product.status === 'Inactive') {
        return { text: 'Inactive', className: 'bg-gray-200 text-gray-500' };
    }
    return { text: 'Active', className: '' };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length > 0 ? (
            products.map((product) => {
              const statusInfo = getStatusInfo(product);
              return (
                <tr key={product.product_id} className={`hover:bg-gray-50 ${statusInfo.className}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{statusInfo.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{`${product.quantity_in_stock} ${product.unit}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(product.selling_price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(product.expiry_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-4">
                    <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900" aria-label="Edit">
                      <Edit size={18} />
                    </button>
                    
                    {/* Deactivate button is only shown for Active products */}
                    {statusInfo.text === 'Active' && (
                      <button onClick={() => onDeactivate(product.product_id)} className="text-yellow-600 hover:text-yellow-900" aria-label="Deactivate">
                        <Trash2 size={18} />
                      </button>
                    )}
                    
                    {/* Permanent Delete button is only shown in the 'Unavailable' view */}
                    {view === 'unavailable' && (
                      <button onClick={() => onPermanentDelete(product.product_id)} className="text-red-600 hover:text-red-900" aria-label="Permanently Delete">
                        <ShieldX size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
             <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                    No products found in this view.
                </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;