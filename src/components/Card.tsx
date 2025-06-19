import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white/60 dark:bg-[#1a223f]/55 rounded-2xl shadow-2xl border border-white/30 dark:border-[#3f51b5]/30 backdrop-blur-2xl ring-1 ring-white/20 dark:ring-[#3f51b5]/10 transition-colors duration-500 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card; 