import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dog } from 'lucide-react';

const Navbar = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between rounded-2xl glass-realistic px-6 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-4'
        }`}>
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onNavigate}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_15px_rgba(244,180,0,0.4)] group-hover:shadow-[0_0_25px_rgba(244,180,0,0.6)] transition-all duration-300">
              <Dog size={24} className="text-black" />
            </div>
            <span className="text-xl tracking-wider flex items-center">
              <span>
                <span className="font-medium">Canine</span>
                <span className="font-bold">Sense</span>
              </span>
              <span className="border border-[var(--color-gold)] text-[var(--color-gold)] font-semibold text-[0.65rem] uppercase tracking-widest px-1.5 py-0.5 rounded ml-2">AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Demo', 'Results'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-300 hover:text-[var(--color-gold)] transition-colors relative group"
                onClick={(e) => {
                  if (item === 'Home') {
                    e.preventDefault();
                    onNavigate();
                  }
                }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-gold)] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
