// frontend/src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Boxes, Truck, Settings } from 'lucide-react'; // Added Settings icon

const mainNavLinks = [
    { to: "/", text: "Dashboard", icon: LayoutDashboard },
    { to: "/billing", text: "Billing (POS)", icon: ShoppingCart },
    { to: "/inventory", text: "Inventory", icon: Boxes },
    { to: "/suppliers", text: "Suppliers", icon: Truck },
];

const Sidebar = () => {
  const baseLinkClass = "flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200";
  const activeLinkClass = "bg-gray-700 font-semibold";

  const getLinkClassName = ({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`;

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen shadow-lg">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">GrocerEase</h1>
        <p className="text-sm text-gray-400">Management System</p>
      </div>
      <nav className="flex-1 px-4 py-4 flex flex-col justify-between">
        <div>
            {mainNavLinks.map((link) => (
            <NavLink
                key={link.to}
                to={link.to}
                className={getLinkClassName}
                end={link.to === "/"} 
            >
                <link.icon className="w-5 h-5 mr-3" />
                <span>{link.text}</span>
            </NavLink>
            ))}
        </div>
        
        {/* Settings link at the bottom */}
        <div>
            <hr className="border-gray-700 my-2" />
            <NavLink
                to="/settings"
                className={getLinkClassName}
            >
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
            </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;