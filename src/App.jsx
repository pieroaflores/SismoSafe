import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import WaveSimulator from './components/WaveSimulator';
import Quiz from './components/Quiz';
import Calculator from './components/Calculator';
import RiskMap from './components/RiskMap';
import About from './components/About';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <WaveSimulator />
        <Quiz />
        <Calculator />
        <RiskMap />
        <About />
      </main>
      <Footer />
    </>
  );
}

export default App;
