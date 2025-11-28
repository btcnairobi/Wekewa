import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", width = 40, height = 40 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 600 600"
      className={className}
    >
      <rect width="100%" height="100%" fill="white" rx="60" /> {/* Added rx for slight rounding if used as icon */}
      
      {/* Minimal W path from user request */}
      <path d="
        M120 150
        L240 450
        L300 330
        L360 450
        L480 150
      "
      fill="none"
      stroke="black"
      strokeWidth="48"
      strokeLinecap="round"
      strokeLinejoin="round"/>
    </svg>
  );
};

export default Logo;