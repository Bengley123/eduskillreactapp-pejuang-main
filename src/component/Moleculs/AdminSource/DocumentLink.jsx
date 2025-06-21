import React from 'react';
import Icon from '../../Elements/AdminSource/Icon';
import Typography from '../../Elements/AdminSource/Typhography';
import { FaIdCard, FaFileAlt, FaFileImage } from 'react-icons/fa';

const DocumentIcon = ({ type }) => {
  const iconMap = {
    ktp: { icon: FaIdCard, color: 'blue-500' },
    kk: { icon: FaFileAlt, color: 'green-500' },
    pasPhoto: { icon: FaFileImage, color: 'purple-500' },
    ijazah: { icon: FaFileAlt, color: 'orange-500' }
  };
  
  const iconData = iconMap[type] || { icon: FaFileAlt, color: 'gray-500' };
  
  return <Icon icon={iconData.icon} color={iconData.color} size="sm" />;
};

const DocumentLink = ({ filename, className = "" }) => {
  if (!filename) {
    return (
      <Typography variant="body2" className="text-gray-400">
        -
      </Typography>
    );
  }
  
  const docType = filename.split('_')[0];
  
  return (
    <a 
      href={`/documents/${filename}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`text-blue-500 hover:underline flex items-center gap-1 ${className}`}
    >
      <DocumentIcon type={docType} />
      <Typography variant="caption">Lihat</Typography>
    </a>
  );
};

export default DocumentLink;