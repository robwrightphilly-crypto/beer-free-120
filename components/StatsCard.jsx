import React from 'react';

const StatsCard = ({ label, value, subValue, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};

export default StatsCard;