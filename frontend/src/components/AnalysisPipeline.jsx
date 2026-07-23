import React from 'react';
import { motion } from 'framer-motion';

const AnalysisPipeline = ({ state }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl px-8 py-6 shadow-2xl max-w-sm w-full mx-auto fixed inset-0 m-auto h-fit z-50 flex flex-col items-center justify-center"
    >
      <div className="relative w-12 h-12 mb-4">
        {/* Subtle background track */}
        <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
        {/* Premium spinning gold ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#EBBE1C] border-r-[#EBBE1C] animate-spin"></div>
        {/* Subtle inner pulse */}
        <div className="absolute inset-3 rounded-full bg-[#EBBE1C]/20 animate-pulse"></div>
      </div>
      <p className="text-white font-medium tracking-wide">Analyzing...</p>
    </motion.div>
  );
};

export default AnalysisPipeline;
