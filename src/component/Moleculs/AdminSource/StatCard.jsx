import React from 'react';
import Typography from '../../Elements/AdminSource/Typhography';
import Icon from '../../Elements/AdminSource/Icon';

const StatCard = ({ title, value, icon, iconColor = "blue-500" }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-start justify-center">
        <Typography variant="caption" className="text-gray-500 mb-2">
          {title}
        </Typography>
        <div className="flex items-center justify-between w-full">
          <Typography variant="h1" className="text-3xl font-bold">
            {value}
          </Typography>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${iconColor.split('-')[0]}-100`}>
            <Icon icon={icon} color={iconColor} size="xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;