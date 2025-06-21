import React from 'react';
import NavigationItem from '../Moleculs/AdminSource/NavigationItem';
import Avatar from '../Elements/AdminSource/Avatar';
import Typography from '../Elements/AdminSource/Typhography';
import { 
  FaHome, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaInfoCircle, 
  FaChartBar,
  FaBell 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, logoSrc, companyName }) => {
  const navigationItems = [
    { href: '/admindashboard', icon: FaHome, label: 'Dashboard Admin' },
    { href: '/adpeserta', icon: FaUsers, label: 'Peserta' },
    { href: '/adpelatihan', icon: FaChalkboardTeacher, label: 'Pelatihan' },
    { href: '/adnotif', icon: FaBell, label: 'Kelola Notifikasi' },
    { href: '/adkonten', icon: FaInfoCircle, label: 'Kelola Informasi' },
    { href: '/adfeedback', icon: FaInfoCircle, label: 'Kelola Feedback' },
    { href: '/adlaporan', icon: FaChartBar, label: 'Unggah Laporan' }
  ];

  return (
    <aside className={`bg-gray-800 text-white flex flex-col h-full transition-all duration-300 ${isOpen ? 'w-full' : 'w-16'}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar src={logoSrc} alt="Company Logo" size="md" />
          <div className={`flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden sm:block'}`}>
            <Typography variant="caption" className="text-[9px] leading-tight font-bold text-white">
              LEMBAGA KURSUS DAN PELATIHAN
            </Typography>
            <Typography variant="h4" className="text-lg font-bold -mt-1 text-white">
              {companyName}
            </Typography>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 mt-6 px-4">
        {navigationItems.map((item, index) => (
          <NavigationItem 
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isOpen={isOpen}
            isActive={window.location.pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;