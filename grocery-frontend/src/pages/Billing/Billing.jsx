// frontend/src/pages/Billing/Billing.jsx
// This is the main component for the Billing (POS) page.

import React, { useState, useEffect } from 'react';
import ProductSelection from './ProductSelection.jsx';
import BillSummary from './BillSummary.jsx';
import ReceiptModal from './ReceiptModal.jsx';
import * as productService from '../../services/productService.js';
import * as billingService from '../../services/billingService.js';

const Billing = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [receiptDetails, setReceiptDetails] = useState(null);

    // Fetch all products on initial component load
    const fetchProducts = async () => {
        try {
            setLoading(true);
            // By default, this now only fetches sellable products (active, in stock, not expired)
            const data = await productService.getAllProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch products. Please check backend connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddToCart = (productId) => {
        const productToAdd = products.find(p => p.product_id === productId);
        const existingItem = cart.find(item => item.product_id === productId);

        if (existingItem) {
            if (existingItem.quantity_sold < productToAdd.quantity_in_stock) {
                setCart(cart.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity_sold: item.quantity_sold + 1 }
                        : item
                ));
            } else {
                alert("Maximum stock reached for this item.");
            }
        } else {
            setCart([...cart, {
                ...productToAdd,
                quantity_sold: 1,
                max_stock: productToAdd.quantity_in_stock
            }]);
        }
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        setCart(cart.map(item => {
            if (item.product_id === productId) {
                const validatedQty = Math.max(1, Math.min(newQuantity, item.max_stock));
                return { ...item, quantity_sold: validatedQty };
            }
            return item;
        }));
    };
    
    const handleRemoveItem = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    // --- MODIFIED ---
    // This function now receives a single object with all bill details.
    const handleGenerateBill = async (billDetails) => {
        const finalBillData = {
            ...billDetails, // Contains customer info, discount, and tax
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity_sold: item.quantity_sold
            }))
        };
        try {
            const result = await billingService.createBill(finalBillData);
            const fullBillDetails = await billingService.getBillById(result.billId);
            setReceiptDetails(fullBillDetails);
            setCart([]); // Clear the cart
            fetchProducts(); // Refresh product list to show updated stock
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to generate bill.');
        }
    };

    if (loading) return <div>Loading Products...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Point of Sale</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
                {/* Product Selection (Left Side) */}
                <div className="lg:col-span-2">
                    <ProductSelection products={products} onAddToCart={handleAddToCart} />
                </div>

                {/* Bill Summary (Right Side) */}
                <div>
                    <BillSummary
                        cartItems={cart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onGenerateBill={handleGenerateBill}
                    />
                </div>
            </div>

            {/* Receipt Modal (conditionally rendered) */}
            {receiptDetails && (
                <ReceiptModal
                    billDetails={receiptDetails}
                    onClose={() => setReceiptDetails(null)}
                />
            )}
        </div>
    );
};

export default Billing;