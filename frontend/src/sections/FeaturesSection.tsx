import React from 'react';
import { Zap, CheckCircle, Lock, Maximize, Smartphone, Zap as Lightning } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';


const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Lightning className="w-12 h-12" />,
      title: "Lightning Fast",
      description: "Download videos at maximum speed with our optimized servers",
      animationDelay: "0s"
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Multiple Formats",
      description: "Download in MP4, MP3, WebM and various quality options",
      animationDelay: "0.1s"
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: "100% Safe",
      description: "Secure downloads without any malware or ads",
      animationDelay: "0.2s"
    },
    {
      icon: <Maximize className="w-12 h-12" />,
      title: "No Limits",
      description: "Download unlimited videos without any restrictions",
      animationDelay: "0.3s"
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Mobile Friendly",
      description: "Works perfectly on all devices and browsers",
      animationDelay: "0.4s"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Easy to Use",
      description: "Simple paste-and-download interface for everyone",
      animationDelay: "0.5s"
    }
  ];

  return (
    <section id="features" className="bg-neutral-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-16 animate__animated animate__fadeIn"
          style={{ opacity: 1, transform: 'translateY(0px)', transition: '0.6s ease-out' }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-300">
            Everything you need for seamless video downloads
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              animationDelay={feature.animationDelay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;