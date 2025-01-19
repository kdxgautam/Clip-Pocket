import React from 'react';

interface GradientDividerProps {
  className?: string;
  height?: string;
  fromColor?: string;
  toColor?: string;
}

const GradientDivider: React.FC<GradientDividerProps> = ({
  className = '',
  height = 'h-20',
  fromColor = 'from-neutral-900',
  toColor = 'to-neutral-800'
}) => {
  return (
    <div 
      className={`w-full ${height} bg-gradient-to-b ${fromColor} ${toColor} ${className}`}
    />
  );
};

export default GradientDivider;