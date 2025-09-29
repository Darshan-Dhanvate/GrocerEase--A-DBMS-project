// frontend/src/pages/Settings/Settings.jsx
import React, { useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import * as adminService from '../../services/adminService.js';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleClearHistory = async () => {
        // This is a highly destructive action, so we use multiple confirmations.
        const confirmation1 = window.prompt("This will permanently delete all sales records. This cannot be undone. To proceed, type 'DELETE' in the box below.");
        
        if (confirmation1 !== 'DELETE') {
            alert("Action cancelled. You did not type 'DELETE'.");
            return;
        }

        const confirmation2 = window.confirm("FINAL CONFIRMATION: Are you absolutely sure you want to delete all transaction history?");
        
        if (!confirmation2) {
            alert("Action cancelled.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            
            const response = await adminService.clearTransactionHistory();
            
            setSuccess(response.message);
            alert(response.message); // Also show a standard alert for immediate feedback

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
            setError(errorMessage);
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Application Settings</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                    <ShieldAlert className="mr-2" />
                    Danger Zone
                </h2>

                <div className="border-t pt-4">
                    <p className="font-semibold">Clear All Transaction History</p>
                    <p className="text-sm text-gray-600 mb-4">
                        Permanently deletes all bills and sales records from the database. This action allows products with past sales to be permanently deleted from the inventory. This cannot be undone.
                    </p>
                    
                    <button
                        onClick={handleClearHistory}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 flex items-center"
                    >
                        <Trash2 size={18} className="mr-2" />
                        {loading ? 'Clearing...' : 'Clear History Now'}
                    </button>
                    
                    {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                    {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}
                </div>
            </div>
        </div>
    );
};

export default Settings;