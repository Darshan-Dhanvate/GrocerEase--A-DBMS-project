// frontend/src/pages/Customers/Customers.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search } from 'lucide-react';
import * as customerService from '../../services/customerService.js';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const data = await customerService.getAllCustomers();
                setCustomers(data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch customer data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) {
            return customers;
        }
        return customers.filter(customer =>
            customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.contact_no && customer.contact_no.includes(searchTerm))
        );
    }, [customers, searchTerm]);

    if (loading) return <div>Loading Customers...</div>;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <Users className="mr-3" size={32} />
                Customer List
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or mobile number..."
                        className="w-full max-w-md p-2 pl-10 border rounded-md"
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <tr key={customer.customer_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{customer.customer_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{customer.contact_no || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.address || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customers;