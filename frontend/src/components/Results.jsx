import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Activity, Eye, BrainCircuit, Heart, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Results = ({ data, onReset }) => {
  const probabilityEntries = Object.entries(
    data.final.probabilities || data.visual.probabilities || {}
  ).map(([label, value]) => ({
    label,
    value: value <= 1 ? value * 100 : value,
  }));

  const colorMap = {
    happy: '#F4B400',
    aggressive: '#EF4444',
    angry: '#EF4444',
    fear: '#A855F7',
    fearful: '#A855F7',
    relaxed: '#3B82F6',
    sad: '#64748B',
  };

  const getEmotionIcon = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'happy': return <Heart className="w-16 h-16 text-green-400" fill="currentColor" />;
      case 'aggressive': return <AlertTriangle className="w-16 h-16 text-red-500" fill="currentColor" />;
      case 'angry': return <AlertTriangle className="w-16 h-16 text-red-500" fill="currentColor" />;
      case 'fear': return <ShieldAlert className="w-16 h-16 text-purple-400" fill="currentColor" />;
      default: return <CheckCircle2 className="w-16 h-16 text-[var(--color-gold)]" />;
    }
  };

  const getEmotionEmoji = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'happy': return '🐶✨';
      case 'aggressive': return '🐺🔥';
      case 'fear': return '🐕‍🦺🧊';
      case 'relaxed': return '🦮💤';
      default: return '🐕';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Prediction <span className="gold-gradient-text">Complete</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mt-2"
            >
              Multimodal analysis successfully fused.
            </motion.p>
          </div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-xl text-sm font-medium"
          >
            <RotateCcw size={16} />
            New Analysis
          </motion.button>
        </div>

        {/* Emotion Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 glass p-6 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 -translate-y-1/2">
               <motion.div 
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
               />
            </div>
            
            <TimelineNode label="Audio Model" value={data.audio.emotion} icon={<Activity size={16}/>} delay={0.3} />
            <TimelineNode label="Visual Model" value={data.visual.emotion} icon={<Eye size={16}/>} delay={0.5} />
            <TimelineNode label="Fusion Engine" value="Synching" icon={<BrainCircuit size={16}/>} delay={0.7} />
            <TimelineNode label="Final Emotion" value={data.final.emotion} icon={<CheckCircle2 size={16}/>} highlight delay={0.9} />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Decision */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-gold p-10 rounded-3xl relative overflow-hidden flex flex-col justify-center items-center text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-10 rounded-full blur-3xl mix-blend-screen"></div>
            
            <h3 className="text-gray-300 font-medium mb-2">Final Decision</h3>
            <div className="flex items-center justify-center gap-6 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.6 }}
                className="text-8xl"
              >
                {getEmotionEmoji(data.final.emotion)}
              </motion.div>
              <h1 className="text-7xl font-black tracking-tight text-white">{data.final.emotion}</h1>
            </div>
            
            <div className="flex justify-center mt-4">
              <CircularGauge value={data.final.confidence} label="Overall Confidence" size={160} color="#F4B400" delay={1.0} />
            </div>
          </motion.div>

          {/* Sub Models */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-3xl flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1"><Activity size={16}/> Audio</div>
                <div className="text-2xl font-bold">{data.audio.emotion}</div>
              </div>
              <CircularGauge value={data.audio.confidence} label="" size={80} color="#3B82F6" delay={1.1} />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass p-6 rounded-3xl flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1"><Eye size={16}/> Visual</div>
                <div className="text-2xl font-bold">{data.visual.emotion}</div>
              </div>
              <CircularGauge value={data.visual.confidence} label="" size={80} color="#10B981" delay={1.2} />
            </motion.div>
          </div>

          {/* Confidence Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 glass p-8 rounded-3xl"
          >
            <h3 className="text-xl font-bold mb-6">Probability Distribution</h3>
            <div className="space-y-6">
              {probabilityEntries.map((entry, index) => (
                <ConfidenceBar
                  key={entry.label}
                  label={entry.label}
                  value={entry.value}
                  color={colorMap[entry.label.toLowerCase()] || '#F4B400'}
                  delay={1.3 + (index * 0.1)}
                />
              ))}
            </div>
          </motion.div>

          {/* Behaviour & Explanation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass p-8 rounded-3xl flex flex-col"
          >
            <h3 className="text-xl font-bold mb-6">Behavioural Traits</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {(data.behaviour || []).map((trait, i) => (
                <span key={i} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium border border-white/5">
                  {trait}
                </span>
              ))}
            </div>
            
            <h3 className="text-xl font-bold mb-4">AI Insight</h3>
            <div className="p-4 bg-[var(--color-dark)] rounded-2xl border border-gray-800 flex-1">
              <p className="text-gray-300 text-sm leading-relaxed">
                {data.explanation}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

const TimelineNode = ({ label, value, icon, highlight, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`flex flex-col items-center bg-[var(--color-dark)] p-4 rounded-2xl z-10 border ${highlight ? 'border-[var(--color-gold)] shadow-[0_0_20px_rgba(244,180,0,0.2)]' : 'border-gray-800'}`}
  >
    <div className={`p-2 rounded-full mb-2 ${highlight ? 'bg-yellow-500/20 text-[var(--color-gold)]' : 'bg-white/10 text-gray-400'}`}>
      {icon}
    </div>
    <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</span>
    <span className={`font-bold ${highlight ? 'text-white' : 'text-gray-300'}`}>{value}</span>
  </motion.div>
);

const CircularGauge = ({ value, label, size = 120, color = "#F4B400", delay = 0 }) => {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const offset = circumference - (currentValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.1 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="font-bold" style={{ fontSize: size * 0.25, color: '#fff' }}>
             <CountUp to={currentValue} duration={1.5} delay={delay} />%
          </span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm text-gray-400 font-medium">{label}</span>}
    </div>
  );
};

// Simple CountUp hook component for numbers
const CountUp = ({ to, duration, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = null;
    let timer = null;
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * to));
      if (progress < 1) {
        timer = window.requestAnimationFrame(step);
      }
    };
    
    const startDelay = setTimeout(() => {
      timer = window.requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(startDelay);
      if (timer) window.cancelAnimationFrame(timer);
    };
  }, [to, duration, delay]);

  return <>{count}</>;
};

const ConfidenceBar = ({ label, value, color, delay }) => (
  <div>
    <div className="flex justify-between text-sm font-medium mb-2">
      <span className="text-gray-300">{label}</span>
      <span className="text-white"><CountUp to={value} duration={1.5} delay={delay} />%</span>
    </div>
    <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: "0%" }}
        animate={{ width: `${value}%` }}
        transition={{ delay, duration: 1.5, type: "spring", bounce: 0.2 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

export default Results;
