// frontend/src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx'; // <-- IMPORT useAuth
import { 
    LayoutDashboard, ShoppingCart, Boxes, Truck, Settings, 
    History, Users, TrendingUp, LogOut, UserCircle 
} from 'lucide-react';

const mainNavLinks = [
    { to: "/", text: "Dashboard", icon: LayoutDashboard },
    { to: "/billing", text: "Billing (POS)", icon: ShoppingCart },
    { to: "/inventory", text: "Inventory", icon: Boxes },
    { to: "/suppliers", text: "Suppliers", icon: Truck },
    { to: "/customers", text: "Customers", icon: Users },
    { to: "/history", text: "History", icon: History },
];

const secondaryNavLinks = [
    { to: "/recommender", text: "Recommender", icon: TrendingUp },
]

const Sidebar = () => {
  const { user, logout } = useAuth(); // <-- GET user and logout function
  const baseLinkClass = "flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm";
  const activeLinkClass = "bg-gray-700 font-semibold";
  const getLinkClassName = ({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`;

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen shadow-lg">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">GrocerEase</h1>
        <p className="text-sm text-gray-400">Management System</p>
      </div>
      <nav className="flex-1 px-4 py-4 flex flex-col justify-between overflow-y-auto">
        {/* Main navigation links */}
        <div>
            {mainNavLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={getLinkClassName} end={link.to === "/"}>
                <link.icon className="w-5 h-5 mr-3" />
                <span>{link.text}</span>
            </NavLink>
            ))}
            <hr className="border-gray-700 my-2" />
            {secondaryNavLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={getLinkClassName}>
                <link.icon className="w-5 h-5 mr-3" />
                <span>{link.text}</span>
            </NavLink>
            ))}
        </div>
        
        {/* Bottom section with user, settings, and logout */}
        <div>
            <hr className="border-gray-700 my-2" />
            <div className="px-4 py-2 text-sm text-gray-300 flex items-center">
                <UserCircle className="w-5 h-5 mr-3" />
                <span>{user?.name || 'Shopkeeper'}</span>
            </div>
            <NavLink to="/settings" className={getLinkClassName}>
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
            </NavLink>
            <button onClick={logout} className={`${baseLinkClass} w-full text-left text-red-400 hover:bg-red-900/50`}>
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
            </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;