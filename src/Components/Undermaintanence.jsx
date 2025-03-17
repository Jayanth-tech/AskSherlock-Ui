import React, { useState, useEffect } from 'react';
import MnBg from "../assets/Maintanence_bg.jpeg";
import logo from "../assets/robot2.png";

const MaintenancePage = () => {
  // Initial time in seconds (24 hours = 86400 seconds)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  
  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v < 10 ? `0${v}` : v)
      .join(':');
  };
  
  // Set up the countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 w-full h-full flex items-end justify-center overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0 w-full h-full" style={{
        backgroundImage: `url(${MnBg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      
      {/* Subtle overlay to enhance readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
      
      {/* Content container positioned at the bottom */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mb-16">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-md bg-white/10 border mt-[10%] border-blue-300/20 rounded-xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <img 
              src={logo}
              alt="Sherlock Logo" 
              className="w-16 h-16"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%2300BFFF' /%3E%3Cpath d='M16 12l-3 3v-2H8v-2h5V9z' fill='white' /%3E%3C/svg%3E";
              }}
            />
          </div>
          
          {/* Title - updated color to match the blue theme */}
          <h1 className="text-4xl font-bold text-cyan-50 mb-6">
            Ask Sherlock is under Maintenance
          </h1>
          
          {/* Countdown timer - commented out as requested */}
          {/* <div className="mb-8">
            <div className="text-blue-200 text-sm mb-2">We'll be back in:</div>
            <div className="text-5xl font-mono text-cyan-300 bg-blue-900/30 rounded-lg py-4 px-6 inline-block">
              {formatTime(timeLeft)}
            </div>
          </div> */}
          
          {/* Progress bar - updated color to match blue theme */}
          {/* <div className="w-full bg-blue-900/50 rounded-full h-4 mb-8">
            <div 
              className="bg-cyan-400 h-4 rounded-full transition-all duration-1000 ease-linear"
              style={{ 
                width: `${(1 - timeLeft / (24 * 60 * 60)) * 100}%`,
                boxShadow: '0 0 10px rgba(0, 191, 255, 0.7)'
              }}
            />
          </div> */}
          
          {/* Message */}
          <p className="text-blue-100 mb-8">
            We're working hard to improve our services and will be back shortly. Thank you for your patience!
          </p>
          
          {/* Social media icons */}
          <div className="flex justify-center space-x-6">
            {['twitter', 'facebook', 'instagram'].map((social) => (
              <div key={social} className="w-10 h-10 rounded-full bg-blue-900/30 hover:bg-blue-700/50 transition-all duration-300 flex items-center justify-center cursor-pointer border border-blue-300/30">
                <div className="text-cyan-300">@</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;