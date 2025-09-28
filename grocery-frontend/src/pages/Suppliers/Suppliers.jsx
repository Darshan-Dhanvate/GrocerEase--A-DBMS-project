// src/pages/Suppliers/Suppliers.jsx
// This is the main component for the Suppliers page.

import React, { useState, useEffect } from 'react';
import SupplierTable from './SupplierTable.jsx';
import SupplierForm from './SupplierForm.jsx';
import * as supplierService from '../../services/supplierService.js';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await supplierService.getAllSuppliers();
            setSuppliers(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch supplier data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (supplier = null) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingSupplier) {
                await supplierService.updateSupplier(editingSupplier.supplier_id, formData);
            } else {
                await supplierService.createSupplier(formData);
            }
            handleCloseModal();
            fetchData(); // Refresh data after submission
        } catch (err) {
            console.error("Failed to save supplier:", err);
            // You can add a toast notification for the user here
        }
    };

    const handleDelete = async (supplierId) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                await supplierService.deleteSupplier(supplierId);
                fetchData(); // Refresh data after deletion
            } catch (err) {
                console.error("Failed to delete supplier:", err);
            }
        }
    };

    if (loading) return <div>Loading Suppliers...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add New Supplier
                </button>
            </div>

            <SupplierTable suppliers={suppliers} onEdit={handleOpenModal} onDelete={handleDelete} />
            
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                        <SupplierForm 
                            initialData={editingSupplier}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;