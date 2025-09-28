// src/pages/Suppliers/SupplierTable.jsx
// This component displays the list of suppliers in a table.

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact No.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <tr key={supplier.supplier_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{supplier.supplier_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{supplier.contact_person || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{supplier.contact_no}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.address || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    aria-label={`Edit ${supplier.supplier_name}`}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(supplier.supplier_id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    aria-label={`Delete ${supplier.supplier_name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No suppliers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;