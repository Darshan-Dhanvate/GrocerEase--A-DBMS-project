// frontend/src/pages/Landing/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const LandingPage = () => {
    return (
        // Full-screen container with a background image
        <div 
            className="flex items-center justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop')" }}
        >
            {/* Semi-transparent overlay to make the text readable */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content Box */}
            <div className="relative z-10 text-center text-white p-8 bg-black bg-opacity-40 rounded-xl shadow-lg backdrop-blur-sm">
                <h1 className="text-5xl font-extrabold mb-3">Welcome to GrocerEase</h1>
                <p className="text-lg mb-8">Your modern solution for inventory management and billing.</p>
                <div className="flex justify-center space-x-4">
                    <Link 
                        to="/login"
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        <LogIn className="mr-2" />
                        Login
                    </Link>
                    <Link 
                        to="/signup"
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        <UserPlus className="mr-2" />
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;