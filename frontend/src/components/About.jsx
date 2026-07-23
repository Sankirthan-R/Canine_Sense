import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, Cpu, ShieldCheck } from 'lucide-react';

const About = () => {
  const features = [
    {
      title: "Audio AI",
      description: "Advanced spectral analysis decodes barks, whines, and growls to detect subtle acoustic emotional markers.",
      icon: <Mic className="w-8 h-8 text-[var(--color-gold)]" />,
      delay: 0.1
    },
    {
      title: "Visual AI",
      description: "Computer vision tracks body posture, tail wag speed, and ear positions in real-time.",
      icon: <Video className="w-8 h-8 text-[var(--color-gold)]" />,
      delay: 0.2
    },
    {
      title: "Transformer Fusion",
      description: "State-of-the-art transformer models synchronize and fuse multi-modal inputs for holistic analysis.",
      icon: <Cpu className="w-8 h-8 text-[var(--color-gold)]" />,
      delay: 0.3
    },
    {
      title: "Decision Engine",
      description: "Confidence-based routing ensures only highly probable emotions are presented to the user.",
      icon: <ShieldCheck className="w-8 h-8 text-[var(--color-gold)]" />,
      delay: 0.4
    }
  ];

  return (
    <section id="about" className="py-32 relative z-10 bg-[var(--color-dark)] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Intelligence Beyond <span className="gold-gradient-text">Instinct</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            We combine two specialized neural networks into a single, seamless pipeline. Discover how our multimodal approach sets a new standard for animal-computer interaction.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)] opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500 blur-2xl"></div>
              
              <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10 group-hover:border-[var(--color-gold)]/50 transition-colors">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[var(--color-gold)] transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
