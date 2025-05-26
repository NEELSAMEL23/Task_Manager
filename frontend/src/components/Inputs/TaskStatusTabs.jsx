import React from 'react';

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`relative flex items-center gap-1 px-3 md:px-4 py-2 text-sm font-medium rounded 
                        ${activeTab === tab.label
                            ? 'text-blue-600 bg-blue-100'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}
                        transition`}
                >
                    <span>{tab.label}</span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full 
                            ${activeTab === tab.label
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'}
                        `}
                    >
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default TaskStatusTabs;
