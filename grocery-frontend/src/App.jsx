// frontend/src/App.jsx
import React from 'react';
// The <Router> component is removed from here
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Import Layout and Pages
import Sidebar from './components/layout/Sidebar.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import LandingPage from './pages/Landing/LandingPage.jsx';
import LoginPage from './pages/Landing/LoginPage.jsx';
import SignupPage from './pages/Landing/SignupPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Billing from './pages/Billing/Billing.jsx';
import Inventory from './pages/Inventory/Inventory.jsx';
import Suppliers from './pages/Suppliers/Suppliers.jsx';
import Customers from './pages/Customers/Customers.jsx';
import History from './pages/History/History.jsx';
import Recommender from './pages/Recommender/Recommender.jsx';
import Settings from './pages/Settings/Settings.jsx';

// This layout component remains the same
const AppLayout = () => (
  <div className="flex h-screen bg-gray-100 font-sans">
    <Sidebar />
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

function App() {
  // The <Router> wrapper is removed from this return statement
  return (
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/history" element={<History />} />
            <Route path="/recommender" element={<Recommender />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
  );
}

export default App;