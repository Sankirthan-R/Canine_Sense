import React from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, Network, ArrowDown, Activity, FileCheck, Layers } from 'lucide-react';

const Technology = () => {
  const steps = [
    { icon: <Video />, text: "Video Upload" },
    { icon: <Mic />, text: "Audio Extraction", split: true },
    { icon: <Activity />, text: "Audio Model", isSplit: true, side: 'left' },
    { icon: <Layers />, text: "Visual Model", isSplit: true, side: 'right' },
    { icon: <Network />, text: "Confidence Fusion" },
    { icon: <FileCheck />, text: "Emotion Prediction" },
    { icon: <FileCheck className="text-[var(--color-gold)]" />, text: "Behaviour Analysis", highlight: true }
  ];

  return (
    <section id="technology" className="py-24 relative overflow-hidden z-20 bg-[var(--color-dark)] border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(244,180,0,0.03)] to-transparent"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-16"
        >
          The <span className="gold-gradient-text">Architecture</span>
        </motion.h2>

        <div className="flex flex-col items-center">
          {/* Node 1: Video Upload */}
          <Node icon={<Video />} text="Video Upload" delay={0.1} />
          <Arrow delay={0.2} />

          {/* Node 2: Audio Extraction */}
          <Node icon={<Mic />} text="Audio Extraction" delay={0.3} />
          <Arrow delay={0.4} />

          {/* Split Section */}
          <div className="flex w-full justify-center gap-12 md:gap-32 relative">
            <div className="flex flex-col items-center">
              <Node icon={<Activity />} text="Audio Model" delay={0.5} />
            </div>
            <div className="flex flex-col items-center">
              <Node icon={<Layers />} text="Visual Model" delay={0.6} />
            </div>
            
            {/* Connecting lines for split */}
            <svg className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-full h-12 -z-10" preserveAspectRatio="none">
              <motion.path 
                d="M 50% 0 Q 25% 40 25% 100" 
                fill="none" 
                stroke="rgba(244,180,0,0.3)" 
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              />
              <motion.path 
                d="M 50% 0 Q 75% 40 75% 100" 
                fill="none" 
                stroke="rgba(244,180,0,0.3)" 
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </svg>
          </div>

          {/* Convergence lines */}
          <div className="flex w-full justify-center gap-12 md:gap-32 relative h-16 mt-4">
             <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10" preserveAspectRatio="none">
              <motion.path 
                d="M 25% 0 Q 25% 60 50% 100" 
                fill="none" 
                stroke="rgba(244,180,0,0.3)" 
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              />
              <motion.path 
                d="M 75% 0 Q 75% 60 50% 100" 
                fill="none" 
                stroke="rgba(244,180,0,0.3)" 
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </svg>
          </div>

          {/* Node 3: Fusion */}
          <Node icon={<Network />} text="Confidence Fusion" delay={0.8} />
          <Arrow delay={0.9} />

          {/* Node 4: Prediction */}
          <Node icon={<FileCheck />} text="Emotion Prediction" delay={1.0} />
          <Arrow delay={1.1} />

          {/* Node 5: Final */}
          <Node icon={<FileCheck className="text-[var(--color-gold)]" />} text="Behaviour Analysis" delay={1.2} highlight />
        </div>
      </div>
    </section>
  );
};

const Node = ({ icon, text, delay, highlight }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, type: "spring" }}
    className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${
      highlight ? 'glass-gold border-[var(--color-gold)] shadow-[0_0_30px_rgba(244,180,0,0.3)]' : 'glass'
    }`}
  >
    <div className={`p-3 rounded-xl ${highlight ? 'bg-yellow-500/20' : 'bg-white/5'}`}>
      {React.cloneElement(icon, { className: highlight ? 'w-6 h-6 text-[var(--color-gold)]' : 'w-6 h-6 text-gray-300' })}
    </div>
    <span className={`font-semibold ${highlight ? 'text-white' : 'text-gray-200'}`}>{text}</span>
  </motion.div>
);

const Arrow = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    whileInView={{ opacity: 1, height: 40 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="w-0.5 bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent my-2 relative"
  >
    <motion.div 
      animate={{ y: [0, 40, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="absolute top-0 left-1/2 -translate-x-1/2"
    >
      <ArrowDown className="text-[var(--color-gold)] w-4 h-4" />
    </motion.div>
  </motion.div>
);

export default Technology;
