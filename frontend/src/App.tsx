import GradientDivider from './components/GradientDivider'
import Hero from './sections/Hero'
import Navbar from './components/Navbar'
import FeaturesSection from './sections/FeaturesSection'
import HowItWorksSection from './sections/HowItWorksSection'
import Footer from './components/Footer'
import { useRef } from 'react'

const App: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    if (section === 'features') {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
      
    } else if (section === 'howItWorks') {
      howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'clip-pocket') {
      heroRef.current?.scrollIntoView({ behavior: 'smooth' });
    }


  };

  return (
    <div className="container">
      <Navbar onLinkClick={scrollToSection} />
      <div ref = {heroRef}>
      <Hero />
      </div>
      <GradientDivider />
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>
      <div ref={howItWorksRef}>
        <HowItWorksSection />
      </div>
      <Footer />
    </div>
  );
};

export default App;
