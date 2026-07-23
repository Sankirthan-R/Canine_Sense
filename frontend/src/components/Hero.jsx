import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Sparkles } from '@react-three/drei';
import ThreeDog from './ThreeDog';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="sticky top-0 min-h-screen flex items-center pt-20 overflow-hidden z-0">
      {/* Background Gradients & Mesh */}
      <div className="absolute inset-0 bg-[var(--color-dark)]">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[var(--color-gold)] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-yellow-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full h-full">

        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold w-fit mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse"></span>
            <span className="text-sm font-medium text-yellow-100">Next-Gen Multimodal AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            AI Powered <br />
            <span className="gold-gradient-text">Canine Emotion</span> <br />
            Detection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg lg:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed"
          >
            Detect your dog's emotional state using advanced multimodal AI by combining audio and visual intelligence with unmatched precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#upload"
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                Analyze Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a
              href="#about"
              className="group px-8 py-4 glass text-white font-medium rounded-2xl flex items-center gap-2 transition-all hover:bg-[rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
            >
              <Play size={20} className="text-[var(--color-gold)]" fill="var(--color-gold)" />
              Learn More
            </a>
          </motion.div>
        </div>

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-[600px] w-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent z-10 pointer-events-none"></div>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            {/* Rich Studio Lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
            <pointLight position={[-5, -5, -5]} intensity={20} color="#F4B400" distance={20} />
            <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={5} color="#F4B400" />
            <Suspense fallback={null}>
              <ThreeDog />
              <Environment preset="city" />
              <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
              <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.2} color="#F4B400" />
            </Suspense>
          </Canvas>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
