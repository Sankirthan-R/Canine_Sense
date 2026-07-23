import React, { Component } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import MainHeroCanvas from './MainHeroCanvas';
import { GoldParticles } from './ThreeDog';

// ── Error boundary so a 3D crash never kills the page ───────────────────────
export class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-gray-600 text-sm">
          3D model unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

// ── easeOutExpo ──────────────────────────────────────────────────────────────
const EXPO = [0.16, 1, 0.3, 1];

const Hero = () => {
  const { scrollY } = useScroll();
  // Cinematic fade out as user scrolls away from Hero
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <motion.section
      id="home"
      style={{ opacity }}
      className="relative min-h-screen pt-32 md:pt-40 pb-20 overflow-hidden z-0 bg-[radial-gradient(ellipse_at_center,_#1e1402_0%,_#000000_100%)] flex items-center"
    >
      {/* ── Full Screen Particle System ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: true, antialias: false }}>
          <GoldParticles count={150} spreadX={30} spreadY={15} depth={8} />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative w-full h-full flex flex-col lg:flex-row items-center justify-between z-10">
        
        {/* ── Text Content Column (Shifted right for balance) ── */}
        <div className="flex flex-col justify-center lg:w-1/2 relative z-20 pointer-events-auto mt-4 lg:mt-0 lg:pl-8 xl:pl-16">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2, ease: EXPO }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold w-fit mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
            <span className="text-sm font-medium text-yellow-100">Next-Gen Multimodal AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: EXPO }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            AI Powered <br />
            <span className="gold-gradient-text">Canine Emotion</span> <br />
            Detection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.4, ease: EXPO }}
            className="text-lg lg:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed"
          >
            Detect your dog's emotional state using advanced multimodal AI by combining audio and visual intelligence with unmatched precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.5, ease: EXPO }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                if (window.__lenis) {
                  window.__lenis.scrollTo('#demo', { offset: -80, duration: 1.5 });
                } else {
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                Analyze Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </a>

            <a
              href="#about"
              className="group px-8 py-4 glass text-white font-medium rounded-2xl flex items-center gap-2 transition-all duration-500 hover:bg-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,255,255,0.05)] hover:scale-[1.02]"
            >
              <Play size={20} className="text-[var(--color-gold)]" fill="var(--color-gold)" />
              Learn More
            </a>
          </motion.div>
        </div>

        {/* ── 3D Scene Container (Strict layout containment, responsive stacking) ── */}
        <div className="w-full relative mt-12 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-[45%] lg:right-0 lg:w-1/2 lg:h-[80%] flex items-center justify-center pointer-events-none z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease: EXPO }}
            className="w-full h-full aspect-square pointer-events-auto"
          >
            <CanvasErrorBoundary>
              <MainHeroCanvas />
            </CanvasErrorBoundary>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
