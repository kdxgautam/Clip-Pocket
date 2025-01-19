import React from 'react';
import { Link2, Clipboard, Download } from 'lucide-react';
import StepCard from '../components/StepCard';


interface HowItWorksSectionProps {
  onTryItClick?: () => void;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onTryItClick = () => {}
}) => {
  const steps = [
    {
      number: 1,
      icon: <Link2 className="w-12 h-12 text-red-500" />,
      title: "Copy URL",
      description: "Copy the YouTube video URL from your browser",
      animationClass: "animate__fadeInLeft"
    },
    {
      number: 2,
      icon: <Clipboard className="w-12 h-12 text-red-500" />,
      title: "Paste URL",
      description: "Paste the URL in our download box",
      animationClass: "animate__fadeInUp",
      animationDelay: "0.2s"
    },
    {
      number: 3,
      icon: <Download className="w-12 h-12 text-red-500" />,
      title: "Download",
      description: "Click download and select your preferred format",
      animationClass: "animate__fadeInRight",
      animationDelay: "0.4s"
    }
  ];

  return (
    <section id="howItWorks" className="bg-neutral-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-16 animate__animated animate__fadeIn"
          style={{ transition: '0.6s ease-out' }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-300">
            Download your favorite videos in three simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-red-500 transform -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <StepCard
                key={step.number}
                number={step.number}
                icon={step.icon}
                title={step.title}
                description={step.description}
                animationDelay={step.animationDelay}
                animationClass={step.animationClass}
              />
            ))}
          </div>

          <div 
            className="mt-16 text-center animate__animated animate__fadeIn"
            style={{ animationDelay: '0.6s', transition: '0.6s ease-out' }}
          >
            <button 
              onClick={onTryItClick}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Try It Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;