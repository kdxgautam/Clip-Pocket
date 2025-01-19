
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    animationDelay?: string;
  }
  
  const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    animationDelay = '0s'
  }) => (
    <div 
      className="bg-neutral-800 rounded-xl p-6 transform hover:scale-105 transition duration-300 animate__animated animate__fadeInUp"
      style={{ animationDelay }}
    >
      <div className="text-red-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );

  export default FeatureCard;