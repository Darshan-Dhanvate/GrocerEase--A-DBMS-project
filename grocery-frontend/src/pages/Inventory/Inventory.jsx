// src/pages/Inventory/Inventory.jsx
// This is the main component for the Inventory page.

import React, { useState, useEffect } from 'react';
import ProductTable from './ProductTable.jsx';
import ProductForm from './ProductForm.jsx';
import * as productService from '../../services/productService.js';
import * as supplierService from '../../services/supplierService.js';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch both products and suppliers when the component mounts
    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, suppliersData] = await Promise.all([
                productService.getAllProducts(),
                supplierService.getAllSuppliers()
            ]);
            setProducts(productsData);
            setSuppliers(suppliersData);
            setError(null);
        } catch (err) {
            setError("Failed to fetch inventory data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.product_id, formData);
            } else {
                await productService.createProduct(formData);
            }
            handleCloseModal();
            fetchData(); // Refresh data after submission
        } catch (err) {
            console.error("Failed to save product:", err);
            // In a real app, you would show a toast notification here
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.deleteProduct(productId);
                fetchData(); // Refresh data after deletion
            } catch (err) {
                console.error("Failed to delete product:", err);
            }
        }
    };

    if (loading) return <div>Loading Inventory...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add New Product
                </button>
            </div>

            <ProductTable products={products} onEdit={handleOpenModal} onDelete={handleDelete} />
            
            {isModalOpen && (
                // This is a simple modal implementation. In a real app, you might use a dedicated modal component.
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <ProductForm 
                            initialData={editingProduct}
                            suppliers={suppliers}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;