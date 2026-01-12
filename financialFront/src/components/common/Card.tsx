import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false
}) => {
  const baseStyles = 'rounded-lg p-6 transition-base';
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';
  const glassStyles = glass ? 'glass-card' : 'bg-white shadow-md';

  return (
    <div className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
