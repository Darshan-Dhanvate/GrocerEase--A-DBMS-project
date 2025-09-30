// frontend/src/pages/Landing/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Get the login function from our context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            // Navigation to the dashboard will happen automatically inside the AuthContext
        } catch (err) {
            setError(err.message || 'Failed to log in. Please check your credentials.');
            setLoading(false);
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

                <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    {/* Display error message if it exists */}
                    {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100"
                    >
                        <LogIn className="mr-2" />
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <p className="text-center text-white mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;