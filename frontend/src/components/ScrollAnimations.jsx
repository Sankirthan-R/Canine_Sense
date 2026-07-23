import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * A reusable viewport-reveal wrapper that gives every element the
 * premium "fade + rise + blur → sharp" entrance animation.
 *
 * Props:
 *   delay   – stagger delay in seconds (default 0)
 *   y       – starting translateY in px (default 40)
 *   blur    – whether to animate blur (default true)
 *   once    – only animate once (default true)
 */
export const Reveal = ({
  children,
  delay = 0,
  y = 40,
  blur = true,
  once = true,
  className = '',
  style = {},
}) => {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{
        opacity: 0,
        y,
        filter: blur ? 'blur(8px)' : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: blur ? 'blur(0px)' : 'none',
      }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Staggered card reveal — wraps a list of items with sequential delay.
 */
export const StaggerCards = ({ children, baseDelay = 0, stagger = 0.1, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.7,
            delay: baseDelay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Parallax wrapper — moves its children at a different rate than scroll.
 * rate: 0 = fixed, 0.5 = half speed, 1 = normal speed
 */
export const ParallaxLayer = ({ children, rate = 0.3, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ['0%', `${rate * 30}%`]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * Image reveal — fades, scales up, and slightly rotates on entrance.
 */
export const ImageReveal = ({ src, alt, className = '', delay = 0 }) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{ opacity: 0, scale: 0.95, rotate: -2, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 1.0,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
};
