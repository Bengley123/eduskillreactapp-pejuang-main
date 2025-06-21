import React from 'react';
import Icon from '../../Elements/AdminSource/Icon';
import Typography from '../../Elements/AdminSource/Typhography';

const NavigationItem = ({ href, icon, label, isOpen, isActive = false }) => {
  return (
    <a 
      href={href} 
      className={`hover:bg-gray-700 px-2 py-2 rounded flex items-center text-white transition-colors ${isActive ? 'bg-gray-700' : ''}`}
    >
      {isOpen ? (
        <>
          <Icon icon={icon} size="md" color="white" className="mr-2" />
          <Typography variant="body2" className="text-white">
            {label}
          </Typography>
        </>
      ) : (
        <div className="text-center w-full">
          <Icon icon={icon} size="lg" color="white" />
        </div>
      )}
    </a>
  );
};

export default NavigationItem;