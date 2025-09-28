// src/pages/Inventory/ProductForm.jsx
// This component provides the form for creating and updating products.

import React, { useState, useEffect } from 'react';

const ProductForm = ({ initialData, suppliers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    brand: '',
    unit: 'piece',
    cost_price: '',
    selling_price: '',
    quantity_in_stock: '',
    expiry_date: '',
    low_stock_threshold: 10,
    supplier_id: '',
  });

  // useEffect populates the form with existing data when in "edit" mode.
  useEffect(() => {
    if (initialData) {
      // Format the date correctly for the date input field
      const formattedData = {
        ...initialData,
        expiry_date: initialData.expiry_date 
          ? new Date(initialData.expiry_date).toISOString().split('T')[0] 
          : '',
        supplier_id: initialData.supplier_id || ''
      };
      setFormData(formattedData);
    } else {
      // Reset form for "add" mode
      setFormData({
        product_name: '', category: '', brand: '', unit: 'piece',
        cost_price: '', selling_price: '', quantity_in_stock: '',
        expiry_date: '', low_stock_threshold: 10, supplier_id: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the form data up to the parent component for API submission
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" className="p-2 border rounded-md" required />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded-md" />
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="p-2 border rounded-md" />
        <select name="unit" value={formData.unit} onChange={handleChange} className="p-2 border rounded-md" required>
          <option value="kg">kg</option>
          <option value="gram">gram</option>
          <option value="liter">liter</option>
          <option value="ml">ml</option>
          <option value="piece">piece</option>
          <option value="packet">packet</option>
        </select>
        <input type="number" name="cost_price" value={formData.cost_price} onChange={handleChange} placeholder="Cost Price" className="p-2 border rounded-md" step="0.01" required />
        <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} placeholder="Selling Price" className="p-2 border rounded-md" step="0.01" required />
        <input type="number" name="quantity_in_stock" value={formData.quantity_in_stock} onChange={handleChange} placeholder="Quantity" className="p-2 border rounded-md" required />
        <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="p-2 border rounded-md" />
        <input type="number" name="low_stock_threshold" value={formData.low_stock_threshold} onChange={handleChange} placeholder="Low Stock Alert" className="p-2 border rounded-md" />
        <select name="supplier_id" value={formData.supplier_id} onChange={handleChange} className="p-2 border rounded-md">
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end mt-6 space-x-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Product</button>
      </div>
    </form>
  );
};

export default ProductForm;