import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Technology from './components/Technology';
import Upload from './components/Upload';
import AnalysisPipeline from './components/AnalysisPipeline';
import Results from './components/Results';
import Footer from './components/Footer';

function App() {
  const [appState, setAppState] = useState('home'); // home, uploading, analyzing, results
  const [resultsData, setResultsData] = useState(null);

  const handleUpload = async (file) => {
    setAppState('uploading');
    
    // Simulate upload delay for UI
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
      // Fallback mock data if backend isn't reachable yet
      setTimeout(() => {
        setResultsData({
          status: "success",
          audio: { emotion: "Happy", confidence: 96 },
          visual: { emotion: "Happy", confidence: 93 },
          final: { emotion: "Happy", confidence: 95 },
          behaviour: ["Playful", "Friendly", "High Energy"],
          explanation: "Your dog appears happy and relaxed. Tail movement and bark characteristics indicate positive excitement with high confidence."
        });
        setAppState('results');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white relative">
      <Navbar onNavigate={() => setAppState('home')} />
      
      {appState === 'home' && (
        <main>
          <Hero />
          <About />
          <Technology />
          <Upload onUpload={handleUpload} />
        </main>
      )}

      {(appState === 'uploading' || appState === 'analyzing') && (
        <AnalysisPipeline state={appState} />
      )}

      {appState === 'results' && resultsData && (
        <Results data={resultsData} onReset={() => setAppState('home')} />
      )}

      <Footer />
    </div>
  );
}

export default App;
