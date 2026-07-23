import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useSpring, useMotionValue, useTransform } from 'framer-motion';

const NavbarMascot = () => {
  const containerRef = useRef(null);
  
  // ── Mouse tracking ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tracking
  const springConfig = { stiffness: 120, damping: 25, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position to subtle eye & head movements
  const eyeX = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);
  const eyeY = useTransform(smoothY, [-0.5, 0.5], [-2, 2]);
  
  const headRotate = useTransform(smoothX, [-0.5, 0.5], [-8, 8]); // Head tilts slightly towards cursor
  const headX = useTransform(smoothX, [-0.5, 0.5], [-2, 2]);
  const headY = useTransform(smoothY, [-0.5, 0.5], [-1, 1]);

  // ── Framer Animation Controls ──
  const controls = useAnimation();
  const leftEarControls = useAnimation();
  const rightEarControls = useAnimation();
  const eyeControls = useAnimation();
  const containerControls = useAnimation();

  useEffect(() => {
    // ── Mouse tracking listener ──
    const handleMouseMove = (e) => {
      // Normalize cursor position from -0.5 to 0.5 relative to screen size
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // ── Idle Behaviour Loop ──
    let timeout;
    let isHidden = false;

    const playRandomIdle = async () => {
      // If hidden, rare chance to peek back out
      if (isHidden) {
        if (Math.random() > 0.3) {
          // Peek back out
          await containerControls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } });
          isHidden = false;
        } else {
          // Stay hidden, try again later
          timeout = setTimeout(playRandomIdle, 5000);
          return;
        }
      }

      // ── Determine if it's time for a rare easter egg ──
      const isRare = Math.random() < 0.15; // 15% chance for a rare animation
      
      if (isRare) {
        // ── RARE BEHAVIOURS (60-90s pacing naturally emerges from rarity) ──
        const rareActions = [
          async () => {
            // Scratch ear
            await leftEarControls.start({ rotate: [0, -20, 0, -20, 0], transition: { duration: 0.6 } });
          },
          async () => {
            // Wag tail (implied by slight body/head shake)
            await controls.start({ rotate: [0, 5, -5, 5, -5, 0], transition: { duration: 0.5 } });
          },
          async () => {
            // Hide behind logo
            isHidden = true;
            await containerControls.start({ x: -40, opacity: 0, transition: { type: "spring", stiffness: 80, damping: 20 } });
          },
          async () => {
            // Double head tilt
            await controls.start({ rotate: [0, 15, -10, 0], transition: { duration: 1.5, type: 'spring' } });
          },
          async () => {
            // Look upward (stretch)
            await controls.start({ y: -4, scaleY: 1.05, transition: { duration: 0.5 } });
            await new Promise(r => setTimeout(r, 600));
            await controls.start({ y: 0, scaleY: 1, transition: { duration: 0.5 } });
          }
        ];
        
        const action = rareActions[Math.floor(Math.random() * rareActions.length)];
        await action();
      } else {
        // ── NORMAL IDLE (15-30s pacing) ──
        const idleActions = [
          async () => {
            // Blink
            await eyeControls.start({ scaleY: [1, 0.1, 1], transition: { duration: 0.15 } });
          },
          async () => {
            // Tiny ear twitch
            await rightEarControls.start({ rotate: [0, 15, 0], transition: { duration: 0.3 } });
          },
          async () => {
            // Breathe / slight scale
            await controls.start({ scale: [1, 1.03, 1], transition: { duration: 1.5, ease: "easeInOut" } });
          },
          async () => {
            // Look left quickly
            await controls.start({ x: -2, transition: { duration: 0.3 } });
            await new Promise(r => setTimeout(r, 800));
            await controls.start({ x: 0, transition: { duration: 0.3 } });
          },
          async () => {
            // Short yawn (eyes close, mouth open if we had one, but we represent it via scale and eye close)
            await Promise.all([
              eyeControls.start({ scaleY: 0.1, transition: { duration: 0.3 } }),
              controls.start({ scaleY: 1.05, y: -2, transition: { duration: 0.4 } })
            ]);
            await new Promise(r => setTimeout(r, 400));
            await Promise.all([
              eyeControls.start({ scaleY: 1, transition: { duration: 0.2 } }),
              controls.start({ scaleY: 1, y: 0, transition: { duration: 0.3 } })
            ]);
          }
        ];
        
        const action = idleActions[Math.floor(Math.random() * idleActions.length)];
        await action();
      }

      // Schedule next random behaviour between 12s and 25s
      const nextDelay = 12000 + Math.random() * 13000;
      timeout = setTimeout(playRandomIdle, nextDelay);
    };

    // Initial delay before first idle
    timeout = setTimeout(playRandomIdle, 10000);

    return () => clearTimeout(timeout);
  }, [controls, leftEarControls, rightEarControls, eyeControls, containerControls]);

  return (
    <motion.div 
      ref={containerRef}
      animate={containerControls}
      className="flex items-center justify-center pointer-events-none z-0 ml-3"
      style={{ width: '32px', height: '32px' }}
    >
      <motion.div
        animate={controls}
        style={{ rotate: headRotate, x: headX, y: headY }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* SVG Drawing of premium minimalist puppy head */}
        <svg viewBox="0 0 100 100" className="w-[28px] h-[28px] drop-shadow-md">
          {/* Base Head Silhouette */}
          <path 
            d="M 25 40 C 25 20, 75 20, 75 40 C 85 45, 90 60, 80 75 C 70 85, 30 85, 20 75 C 10 60, 15 45, 25 40 Z" 
            fill="var(--color-gold)"
            opacity="0.9"
          />
          
          {/* Left Ear */}
          <motion.path 
            animate={leftEarControls}
            style={{ originX: "30px", originY: "35px" }} // Rotate from attach point
            d="M 25 40 C 15 30, 5 45, 12 60 C 16 68, 28 65, 22 50 Z" 
            fill="var(--color-gold)"
          />

          {/* Right Ear */}
          <motion.path 
            animate={rightEarControls}
            style={{ originX: "70px", originY: "35px" }} // Rotate from attach point
            d="M 75 40 C 85 30, 95 45, 88 60 C 84 68, 72 65, 78 50 Z" 
            fill="var(--color-gold)"
          />

          {/* Snout/Muzzle area - slightly darker or lighter for contrast */}
          <ellipse cx="50" cy="65" rx="18" ry="14" fill="#ffffff" opacity="0.15" />
          
          {/* Nose */}
          <motion.path 
            style={{ x: eyeX, y: eyeY }} // Nose moves slightly with eyes for depth
            d="M 45 62 C 45 60, 55 60, 55 62 C 55 65, 52 68, 50 68 C 48 68, 45 65, 45 62 Z" 
            fill="#111" 
          />

          {/* Eyes Group */}
          <motion.g animate={eyeControls} style={{ originX: "50px", originY: "50px" }}>
            {/* Left Eye */}
            <motion.circle 
              style={{ x: eyeX, y: eyeY }} 
              cx="38" cy="48" r="4.5" fill="#111" 
            />
            {/* Right Eye */}
            <motion.circle 
              style={{ x: eyeX, y: eyeY }} 
              cx="62" cy="48" r="4.5" fill="#111" 
            />
            
            {/* Tiny catchlights (eye shine) for premium alive feel */}
            <motion.circle style={{ x: eyeX, y: eyeY }} cx="36.5" cy="46.5" r="1.5" fill="#fff" opacity="0.8"/>
            <motion.circle style={{ x: eyeX, y: eyeY }} cx="60.5" cy="46.5" r="1.5" fill="#fff" opacity="0.8"/>
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default NavbarMascot;
