import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-dark)] z-[-1]"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-gold)] opacity-5 blur-[150px] rounded-t-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="font-semibold text-gray-300">NMAM Institute of Technology</p>
          <p>Artificial Intelligence & Data Science</p>
        </div>
        
        <div className="text-center md:text-right">
          <p className="font-medium text-[var(--color-gold)]">Multimodal Canine Emotion Detection</p>
          <p>&copy; 2026 CanineSense AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
