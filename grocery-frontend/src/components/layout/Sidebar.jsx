// src/components/layout/Sidebar.jsx
// This component renders the main navigation sidebar for the application.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Boxes, Truck } from 'lucide-react';

// An array of navigation links to keep the code clean and scalable
const navLinks = [
    { to: "/", text: "Dashboard", icon: LayoutDashboard },
    { to: "/billing", text: "Billing (POS)", icon: ShoppingCart },
    { to: "/inventory", text: "Inventory", icon: Boxes },
    { to: "/suppliers", text: "Suppliers", icon: Truck },
];

const Sidebar = () => {
  // This is the base style for all NavLink components.
  const baseLinkClass = "flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200";
  // This style is applied conditionally when the NavLink is active.
  const activeLinkClass = "bg-gray-700 font-semibold";

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen shadow-lg">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">GrocerEase</h1>
        <p className="text-sm text-gray-400">Management System</p>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            // The `className` prop for NavLink can be a function.
            // It receives an `isActive` boolean, which we use to apply the active style.
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
            }
            // `end` prop ensures this link is only active when the URL is exactly "/"
            end={link.to === "/"} 
          >
            <link.icon className="w-5 h-5 mr-3" />
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
