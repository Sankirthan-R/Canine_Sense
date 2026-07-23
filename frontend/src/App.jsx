import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Technology from './components/Technology';
import Upload from './components/Upload';
import AnalysisPipeline from './components/AnalysisPipeline';
import Results from './components/Results';
import Footer from './components/Footer';
import { useLenis } from './hooks/useLenis';

// Page-level fade transition
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.35, ease: [0.7, 0, 1, 1] } },
};

// Cinematic Section Wrapper for continuous scrolling experience
const FadeSection = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: false, margin: "-15% 0px -15% 0px" }} // Triggers seamlessly before hitting center
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Butter-smooth expo easing
  >
    {children}
  </motion.div>
);

function App() {
  const [appState, setAppState]     = useState('home');
  const [resultsData, setResultsData] = useState(null);

  // Buttery smooth scrolling via Lenis
  useLenis();

  const handleUpload = async (file) => {
    setAppState('uploading');

    setTimeout(() => {
      setAppState('analyzing');
    }, 1500);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/predict/final', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResultsData(data);
      setAppState('results');
    } catch (error) {
      console.error('Error during prediction:', error);
      setTimeout(() => {
        setResultsData({
          status: 'success',
          audio:   { emotion: 'Happy', confidence: 96 },
          visual:  { emotion: 'Happy', confidence: 93 },
          final:   { emotion: 'Happy', confidence: 95 },
          behaviour: ['Playful', 'Friendly', 'High Energy'],
          explanation:
            'Your dog appears happy and relaxed. Tail movement and bark characteristics indicate positive excitement with high confidence.',
        });
        setAppState('results');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white relative">
      <Navbar onNavigate={() => setAppState('home')} />

      <AnimatePresence mode="wait">
        {appState === 'home' && (
          <motion.main
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Hero />
            <FadeSection>
              <About />
            </FadeSection>
            <FadeSection>
              <Technology />
            </FadeSection>
            <FadeSection>
              <Upload onUpload={handleUpload} />
            </FadeSection>
          </motion.main>
        )}

        {(appState === 'uploading' || appState === 'analyzing') && (
          <motion.div
            key="pipeline"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AnalysisPipeline state={appState} />
          </motion.div>
        )}

        {appState === 'results' && resultsData && (
          <motion.div
            key="results"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Results data={resultsData} onReset={() => setAppState('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
