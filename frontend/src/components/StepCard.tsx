import React from 'react';


interface StepCardProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  animationDelay?: string;
  animationClass: string;
}

const StepCard: React.FC<StepCardProps> = ({
  number,
  icon,
  title,
  description,
  animationDelay = '0s',
  animationClass
}) => (
  <div
    className={`bg-neutral-900 rounded-xl p-8 text-center transform hover:-translate-y-2 transition duration-300 animate__animated ${animationClass}`}
    style={{ animationDelay }}
  >
    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-2xl font-bold text-white">{number}</span>
    </div>
    <div className="bg-neutral-800 rounded-lg p-4 mb-6 mx-auto w-20 h-20 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default StepCard;
