// frontend/src/App.jsx
// Final root component with all pages and routing configured.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Component
import Sidebar from './components/layout/Sidebar.jsx';

// Page Components
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Billing from './pages/Billing/Billing.jsx';
import Inventory from './pages/Inventory/Inventory.jsx';
import Suppliers from './pages/Suppliers/Suppliers.jsx';
import Settings from './pages/Settings/Settings.jsx'; // <-- IMPORT the new page

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/settings" element={<Settings />} /> {/* <-- ADD the new route */}
            
            {/* A catch-all route for pages that don't exist */}
            <Route path="*" element={<h1 className="text-3xl font-bold">404: Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;