// src/pages/Dashboard/KpiCard.jsx
// A reusable card component to display key performance indicators (KPIs) on the dashboard.

import React from 'react';

const KpiCard = ({ title, value, icon, colorClass = 'text-gray-800' }) => {
  // This component receives data as props and displays it in a styled card.
  // The icon is passed as a component, and we style it with color classes.
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center">
        <div className={`mr-4 p-3 rounded-full ${colorClass.replace('text', 'bg')}-100`}>
          {/* We clone the icon element to add CSS classes for styling. */}
          {React.cloneElement(icon, { className: `w-6 h-6 ${colorClass}` })}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;