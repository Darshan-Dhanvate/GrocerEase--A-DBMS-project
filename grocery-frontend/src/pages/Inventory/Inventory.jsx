// frontend/src/pages/Inventory/Inventory.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
    // New state to manage the current view (e.g., 'default', 'unavailable', 'all')
    const [view, setView] = useState('default');

    // This function fetches all data needed for the page.
    // useCallback ensures it's not recreated on every render, which is good practice.
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // We now pass the current 'view' state to the API call.
            const productsData = await productService.getAllProducts(view);
            const suppliersData = await supplierService.getAllSuppliers(); // Gets only active suppliers
            
            setProducts(productsData);
            setSuppliers(suppliersData);
            setError(null);
        } catch (err) {
            setError("Failed to fetch inventory data. Please check the backend connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [view]); // The function will automatically re-run whenever the 'view' state changes.

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save product.');
        }
    };

    // Calls the deactivateProduct service function
    const handleDeactivate = async (productId) => {
        if (window.confirm("Are you sure you want to deactivate this product? It will no longer be available for sale.")) {
            try {
                await productService.deactivateProduct(productId);
                fetchData();
            } catch (err) {
                 alert(err.response?.data?.message || 'Failed to deactivate product.');
            }
        }
    };

    // Calls the new permanentlyDeleteProduct service function
    const handlePermanentDelete = async (productId) => {
        if (window.confirm("DANGER: Are you sure you want to permanently delete this product? This action cannot be undone.")) {
            try {
                await productService.permanentlyDeleteProduct(productId);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to permanently delete product.');
            }
        }
    };
    
    // Helper for styling the active filter button
    const getButtonClass = (buttonView) => {
        return view === buttonView
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100';
    };


    if (loading) return <div>Loading Inventory...</div>;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add New Product
                </button>
            </div>
            
            {/* Filter Buttons */}
            <div className="mb-4 flex space-x-2 border-b pb-2">
                <button onClick={() => setView('default')} className={`px-4 py-2 rounded-md text-sm font-medium ${getButtonClass('default')}`}>Sellable Items</button>
                <button onClick={() => setView('unavailable')} className={`px-4 py-2 rounded-md text-sm font-medium ${getButtonClass('unavailable')}`}>Unavailable Items</button>
                <button onClick={() => setView('all')} className={`px-4 py-2 rounded-md text-sm font-medium ${getButtonClass('all')}`}>View All</button>
            </div>

            <ProductTable 
                products={products} 
                onEdit={handleOpenModal} 
                onDeactivate={handleDeactivate}
                onPermanentDelete={handlePermanentDelete}
                view={view}
            />
            
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50">
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