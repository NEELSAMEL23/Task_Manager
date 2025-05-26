import React from 'react';
import StatCard from './StatCard'; // Make sure StatCard is imported

const UserCard = ({ userInfo = {} }) => {
  const {
    profileImageUrl,
    name = 'Unknown User',
    email = 'No Email',
    pendingTasks = 0,
    inProgressTasks = 0,
    completedTasks = 0,
  } = userInfo;

  return (
    <div className="user-card p-4 bg-white rounded shadow-sm">
      {/* User Info Section */}
      <div className="flex items-center gap-3">
        <img
          src={profileImageUrl}
          alt="Avatar"
          className="w-12 h-12 rounded-full border-2 border-white object-cover"
        />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex gap-3 mt-5">
        <StatCard label="Pending" count={pendingTasks} status="Pending" />
        <StatCard label="In Progress" count={inProgressTasks} status="In Progress" />
        <StatCard label="Completed" count={completedTasks} status="Completed" />
      </div>
    </div>
  );
};

export default UserCard;
