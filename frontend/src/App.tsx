import GradientDivider from './components/GradientDivider'
import Hero from './sections/Hero'
import Navbar from './components/Navbar'
import FeaturesSection from './sections/FeaturesSection'
import HowItWorksSection from './sections/HowItWorksSection'
import Footer from './components/Footer'

const App:React.FC = () => {
  return (
    <div className="container">
      <div>
      <Navbar/>
      <Hero/>
      <GradientDivider/>
      <FeaturesSection/>
      <HowItWorksSection/>
      <Footer/>
      </div>
    </div>
  )
}
export default App