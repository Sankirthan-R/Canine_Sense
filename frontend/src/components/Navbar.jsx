import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import InteractiveNavbarMascot from './InteractiveNavbarMascot';

const Navbar = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Maps scroll depth to a subtle moving reflection on the glass
  const reflectionPosition = useTransform(scrollY, [0, 2000], ['-100%', '200%']);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Use passive listener to avoid blocking the main thread during scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-[80%] max-w-5xl rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
        scrolled 
          // Ultra-Premium Floating HUD Glass (Apple Vision Pro Style)
          ? 'bg-[#050505]/40 backdrop-blur-[48px] saturate-[1.2] border border-white/[0.12] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)] shadow-[inset_0_-2px_6px_rgba(244,180,0,0.08)] shadow-[inset_0_0_30px_rgba(255,255,255,0.03)]' 
          : 'bg-[#050505]/10 backdrop-blur-[16px] border border-white/[0.08] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]'
      }`}
    >
      {/* Subtle dynamic scrolling reflection layer */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
        style={{
          background: 'linear-gradient(120deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 80%)',
          backgroundSize: '200% 100%',
          backgroundPositionX: reflectionPosition
        }}
      />

      <div className="mx-auto px-6 md:px-8 w-full relative z-10">
        <div className={`flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? 'h-12' : 'h-[3.5rem] md:h-14'
        }`}>
          {/* Logo & Mascot */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onNavigate}
          >
            {/* The new unified Interactive Mascot replaces the old static Lucide Dog icon */}
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
              <InteractiveNavbarMascot />
            </div>
            
            <span className="text-xl tracking-wider flex items-center relative z-10">
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
