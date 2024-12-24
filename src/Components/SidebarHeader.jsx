// components/Sidebar/SidebarHeader.jsx
import React from 'react';
import { X } from 'lucide-react';
import QuinnoxLogo from '../assets/Quinnox-Logo.svg';

const SidebarHeader = ({ onClose }) => (
  <div className="flex  items-center justify-between p-2 border-b border-gray-200">
    {/* Quinnox Logo */}
    <img 
      src={QuinnoxLogo} 
      alt="Quinnox Logo" 
      className="h-6 sm:h-12 md:h-14 lg:h-16 w-auto object-contain" 
    />
    {/* Close Button */}
    <button 
      onClick={onClose} 
      className=" md:hidden text-gray-600 hover:text-gray-800"
      aria-label="Close sidebar"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

export default SidebarHeader;
