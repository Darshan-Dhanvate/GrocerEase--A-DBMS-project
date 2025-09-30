// frontend/src/pages/Landing/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx'; // <-- IMPORT useAuth

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth(); // <-- GET THE SIGNUP FUNCTION
    const navigate = useNavigate();

    // --- THIS FUNCTION IS NOW FULLY IMPLEMENTED ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup({ name, email, password });
            alert('Signup successful! Please log in.');
            navigate('/login'); // Redirect to login page after successful signup
        } catch (err) {
            setError(err.message || 'Failed to sign up.');
        }
    };

    return (
        <div 
            className="flex items-center justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 rounded-xl shadow-lg backdrop-blur-md">
                <Link to="/landing" className="absolute top-4 left-4 text-white hover:text-gray-300">
                    <ArrowLeft />
                </Link>

                <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input fields remain the same */}
                    <div>
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input 
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    {/* Error message display */}
                    {error && <p className="text-red-400 text-center text-sm">{error}</p>}

                    <button 
                        type="submit"
                        className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        <UserPlus className="mr-2" />
                        Sign Up
                    </button>
                </form>
                
                <p className="text-center text-white mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;