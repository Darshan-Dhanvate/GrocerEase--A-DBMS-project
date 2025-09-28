// src/pages/Suppliers/SupplierForm.jsx
// This component provides the form for creating and updating suppliers.

import React, { useState, useEffect } from 'react';

const SupplierForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    supplier_name: '',
    contact_person: '',
    contact_no: '',
    address: '',
  });

  // useEffect populates the form with existing data when in "edit" mode.
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form for "add" mode
      setFormData({
        supplier_name: '',
        contact_person: '',
        contact_no: '',
        address: '',
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
      <div className="space-y-4">
        <input type="text" name="supplier_name" value={formData.supplier_name} onChange={handleChange} placeholder="Supplier Name" className="w-full p-2 border rounded-md" required />
        <input type="text" name="contact_person" value={formData.contact_person} onChange={handleChange} placeholder="Contact Person" className="w-full p-2 border rounded-md" />
        <input type="text" name="contact_no" value={formData.contact_no} onChange={handleChange} placeholder="Contact Number" className="w-full p-2 border rounded-md" required />
        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded-md" rows="3"></textarea>
      </div>
      <div className="flex justify-end mt-6 space-x-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Supplier</button>
      </div>
    </form>
  );
};

export default SupplierForm;