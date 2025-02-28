import React, { useState } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import Robot from "../assets/robot2.png";
import Marquee from "react-fast-marquee";

const ChatHeader = ({ userName, userEmail, photo, onOpenSidebar, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between relative ">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-1 hover:bg-gray-100 rounded-full md:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <img src={Robot} alt="Bot" className="w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10 rounded-2xl sm:w-6 sm:h-6" />

        <div className="flex flex-col relative">
          <h1 
            className="text-lg md:text-xl noto-serif-old-uyghur-regular font-black text-purple-800 cursor-pointer"
          >
            Ask Sherlock
            <span className='text-xs font-black text-gray-400 absolute'  
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
              ⓘ
            </span>
          </h1>

          <span className="text-xs sm:text-xs pr-1 text-orange-500 font-medium">
            Powered by QAI STUDIO
          </span>

          {/* Improved Tooltip */}
          <div
            className={`
              absolute 
              z-10
              w-64
              bg-gray-700 
              text-white 
              text-xs 
              rounded 
              p-2
              top-1 ml-52
              left-1/2 
              -translate-x-1/2
              transition-all 
              duration-300
              ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}
          >
            You can Ask Sherlock to mine and discover information from all our past proposals, client PPTs, and case studies.
          </div>
        </div>
      </div>

      {/* Marquee Section - Now a flex-grow element between left and right sections */}
      <div className="flex-1 mx-4 px-4 text-gray-600 overflow-hidden">
        <Marquee>
          "AskSherlock" is designed to mine and discover content from past client presentations, RFP proposals, and case studies. It does not provide personal or company-sensitive data.
        </Marquee>
      </div>

      {/* Right Section - User Info */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="hidden w-full sm:block text-sm md:text-base noto-serif-old-uyghur-regular text-gray-700">
          {userName}
        </span>
        <button 
          onClick={handleUserClick}
          className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center"
        >
          {photo ? (
            <img 
              src={photo} 
              alt="User Avatar" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          )}
        </button>

        {/* User Menu Popup */}
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {photo ? (
                    <img 
                      src={photo} 
                      alt="User Avatar" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{userName}</span>
                  <span className="text-sm text-gray-500">{userEmail}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;