import React from 'react';

const StatCard = ({ label = "Label", count = 0, status = "Pending" }) => {
  const getStatusTagStyle = () => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
      case 'Completed':
        return 'text-lime-500 bg-lime-50 border border-lime-500/10';
      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  return (
    <div className={`flex-1 px-4 py-1 rounded text-[10px] font-medium ${getStatusTagStyle()}`}>
      <span className="block text-[12px] font-semibold">{count}</span>
      {label}
    </div>
  );
};

export default StatCard;
