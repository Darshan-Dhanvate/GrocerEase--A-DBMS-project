// frontend/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // While the app is checking for a token on initial load, show a loading message.
    // This prevents a "flicker" where the login page might briefly appear.
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    // If the check is complete and there's a user, render the child routes (Outlet).
    // Otherwise, redirect the user to the login page.
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;