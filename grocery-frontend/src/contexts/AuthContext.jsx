// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService.js';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // To handle initial auth check
    const navigate = useNavigate();

    // This effect runs on app startup to check if a user is already logged in
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // Finished initial check
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            setToken(data.token);
            navigate('/'); // Redirect to dashboard on successful login
        } catch (error) {
            // Re-throw the error so the login page can display it
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            await authService.signup(userData);
            // Optionally, you can log them in directly after signup
            // For now, we'll redirect them to the login page to sign in.
            navigate('/login');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
        navigate('/login'); // Redirect to login page on logout
    };

    // The value provided to the context consumers
    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};