import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InteractiveNavbarMascot = () => {
  const containerRef = useRef(null);
  const headRef = useRef(null);
  const leftEarRef = useRef(null);
  const rightEarRef = useRef(null);
  const eyeLeftRef = useRef(null);
  const eyeRightRef = useRef(null);
  const noseRef = useRef(null);
  const pawRightRef = useRef(null);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const current = { 
      x: 0, y: 0, 
      blink: 1, 
      earRotL: 0, earRotR: 0, 
      headScaleY: 1, headScaleX: 1,
      headRot: 0,
      pawY: 50,
      scratchPhase: 0 
    };
    
    let activeBehavior = 'idle'; // 'idle', 'hidden', 'scratching', 'peeking'
    let animationFrameId;
    let lastTime = performance.now();
    let behaviorTimer;

    const handleMouseMove = (e) => {
      if (activeBehavior === 'scratching') return; 
      
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);
      
      target.x = THREE.MathUtils.clamp(dx, -1, 1);
      target.y = THREE.MathUtils.clamp(dy, -1, 1);
      
      if (activeBehavior === 'hidden' && Math.abs(dx) < 0.2) {
        activeBehavior = 'peeking'; // transition from hidden to peeking
        target.x = dx;
        target.y = dy;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const handleMouseLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    window.addEventListener('mouseleave', handleMouseLeave);

    // ── Click Interaction ──
    const handleMascotClick = () => {
      if (activeBehavior === 'clicked') return;
      activeBehavior = 'clicked';
      
      // Pop out happily
      target.x = 1.0; 
      target.y = -0.2;
      current.headScaleY = 1.1; // Stretch up happily
      
      setTimeout(() => {
        // Playful wink
        if (eyeLeftRef.current) {
          eyeLeftRef.current.style.transform = `translate(${current.x * 5}px, ${current.y * 4}px) scaleY(0.1)`;
        }
        current.earRotL = -25;
        current.earRotR = 25;
      }, 300);
      
      setTimeout(() => {
        if (eyeLeftRef.current) {
          eyeLeftRef.current.style.transform = `translate(${current.x * 5}px, ${current.y * 4}px) scaleY(1)`;
        }
        current.earRotL = 0;
        current.earRotR = 0;
        current.headScaleY = 1.0;
        target.x = 0;
        target.y = 0;
        activeBehavior = 'idle';
      }, 900);
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('click', handleMascotClick);
      // Also enable pointer events on the container so it can be clicked
      containerRef.current.style.pointerEvents = 'auto';
      containerRef.current.style.cursor = 'pointer';
    }

    const playRandomBehavior = () => {
      const rand = Math.random();
      
      if (activeBehavior === 'hidden' || activeBehavior === 'peeking') {
        if (rand > 0.4) activeBehavior = 'idle'; 
      } else if (activeBehavior === 'idle') {
        if (rand < 0.05) {
          activeBehavior = 'hidden';
        } else if (rand < 0.20) {
          // Playful Scratch (Subtle)
          activeBehavior = 'scratching';
          target.x = 0.5; // Slight tilt
          target.y = 0.1;
          
          let scratchCount = 0;
          const scratchInterval = setInterval(() => {
            current.scratchPhase += 0.8;
            current.earRotR = Math.sin(current.scratchPhase) * 20; // Less exaggerated
            current.blink = Math.random() > 0.6 ? 0.2 : 0.9;
            current.pawY = 28 + Math.sin(current.scratchPhase) * 8; 
            
            scratchCount++;
            if (scratchCount > 16) {
              clearInterval(scratchInterval);
              current.earRotR = 0;
              current.pawY = 50;
              current.blink = 1;
              target.x = 0;
              target.y = 0;
              activeBehavior = 'idle';
            }
          }, 60);
          
        } else if (rand < 0.30) {
          // Yawn & Stretch
          current.headScaleY = 1.15;
          current.headScaleX = 0.85;
          current.blink = 0.1;
          setTimeout(() => {
             current.headScaleY = 1;
             current.headScaleX = 1;
             current.blink = 1;
          }, 1200);
        } else if (rand < 0.45) {
          // Look around randomly
          target.x = (Math.random() - 0.5) * 0.8;
          target.y = (Math.random() - 0.5) * 0.5;
          setTimeout(() => { target.x = 0; target.y = 0; }, 1500 + Math.random() * 1000);
        } else if (rand < 0.65) {
          // Double Blink
          current.blink = 0.1;
          setTimeout(() => { current.blink = 1; }, 100);
          setTimeout(() => { current.blink = 0.1; }, 200);
          setTimeout(() => { current.blink = 1; }, 300);
        } else if (rand < 0.80) {
          // Happy / Proud Idle (Soft side to side tilt)
          target.x = 0.3;
          current.headRot = 8;
          setTimeout(() => { 
            target.x = -0.3;
            current.headRot = -8; 
          }, 1200);
          setTimeout(() => { current.headRot = 0; target.x = 0; }, 2400);
        } else if (rand < 0.90) {
          // Curious Peek (Subtle)
          current.earRotL = -15;
          current.earRotR = 15;
          setTimeout(() => { 
            current.earRotL = 0;
            current.earRotR = 0;
          }, 1500);
        } else {
          // Single Blink
          current.blink = 0.1;
          setTimeout(() => { current.blink = 1; }, 120);
        }
      }

      // Rare behaviors timing requested: 45s to 90s for the rare ones, but we'll mix it.
      // Standard idles like blinking can happen faster, but the loop itself runs every 5s-12s,
      // which organically spaces out the rare events (like hiding/scratching).
      behaviorTimer = setTimeout(playRandomBehavior, 5000 + Math.random() * 7000);
    };
    
    behaviorTimer = setTimeout(playRandomBehavior, 3000);

    const render = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      
      const damping = 1 - Math.exp(-8 * delta); // Increased from 6 for snappier, responsive feel
      const fastDamping = 1 - Math.exp(-15 * delta);

      current.x = THREE.MathUtils.lerp(current.x, target.x, damping);
      current.y = THREE.MathUtils.lerp(current.y, target.y, damping);

      // Continuous organic breathing
      const breatheScale = 1 + Math.sin(time / 800) * 0.015;

      if (headRef.current) {
        // Increased rotation and translation for noticeable cursor tracking
        const headRot = activeBehavior === 'scratching' ? current.x * 15 : current.x * 18 + current.headRot; 
        const headX = current.x * 12;
        const headY = current.y * 6;
        
        const visibilityOffset = activeBehavior === 'hidden' ? -80 : (activeBehavior === 'peeking' ? -40 : 0);
        
        // Apply organic continuous breathe scale multiplied by behavior scale
        const finalScaleY = current.headScaleY * breatheScale;
        const finalScaleX = current.headScaleX * (2 - breatheScale); // Inverse squash and stretch
        
        headRef.current.style.transform = `translateX(${headX + visibilityOffset}px) translateY(${headY}px) rotate(${headRot}deg) scale(${finalScaleX}, ${finalScaleY})`;
      }

      if (eyeLeftRef.current && eyeRightRef.current && noseRef.current) {
        // Significantly increased eye movement for deep tracking feel
        const eyeOffsetX = current.x * 12;
        const eyeOffsetY = current.y * 10;
        
        eyeLeftRef.current.style.transform = `translate(${eyeOffsetX}px, ${eyeOffsetY}px) scaleY(${current.blink})`;
        eyeRightRef.current.style.transform = `translate(${eyeOffsetX}px, ${eyeOffsetY}px) scaleY(${current.blink})`;
        noseRef.current.style.transform = `translate(${eyeOffsetX * 1.5}px, ${eyeOffsetY * 1.5}px)`;
      }

      if (leftEarRef.current && rightEarRef.current) {
        const rotL = leftEarRef.current._rot || 0;
        const rotR = rightEarRef.current._rot || 0;
        
        leftEarRef.current._rot = THREE.MathUtils.lerp(rotL, current.earRotL, fastDamping);
        
        if (activeBehavior !== 'scratching') {
           rightEarRef.current._rot = THREE.MathUtils.lerp(rotR, current.earRotR, fastDamping);
        } else {
           rightEarRef.current._rot = current.earRotR;
        }
        
        leftEarRef.current.style.transform = `rotate(${leftEarRef.current._rot}deg)`;
        rightEarRef.current.style.transform = `rotate(${rightEarRef.current._rot}deg)`;
      }
      
      if (pawRightRef.current) {
        pawRightRef.current.style.transform = `translateY(${current.pawY}px) rotate(-25deg)`;
        pawRightRef.current.style.opacity = activeBehavior === 'scratching' ? '1' : '0';
      }

      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleMascotClick);
      }
      clearTimeout(behaviorTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex items-center justify-center pointer-events-none z-10 ml-2 overflow-visible w-10 h-10 md:w-11 md:h-11"
    >
      <div className="w-full h-full flex items-center justify-center overflow-visible">
        {/* Massive viewBox gives huge transparent padding around the actual asset so animations never clip */}
        <svg viewBox="-50 -50 200 200" className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] overflow-visible">
          
          <defs>
            <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFEA8C" />
              <stop offset="50%" stopColor="#F4B400" />
              <stop offset="100%" stopColor="#C98A00" />
            </linearGradient>
            
            <filter id="depthFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.25" floodColor="#000" />
            </filter>
            
            <filter id="innerHighlight">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
              <feFlood floodColor="white" floodOpacity="0.55"/>
              <feComposite in2="shadowDiff" operator="in"/>
              <feComposite in2="SourceGraphic" operator="over"/>
            </filter>
          </defs>

          <g ref={headRef} style={{ transformOrigin: '50px 50px' }} filter="url(#depthFilter)">
            
            {/* ── Left Ear (Soft, rounded cartoon style) ── */}
            <path 
              ref={leftEarRef}
              style={{ transformOrigin: "22px 30px" }} 
              d="M 25 35 C -5 20, -10 50, 10 70 C 15 75, 30 70, 30 45 Z" 
              fill="url(#premiumGold)"
              filter="url(#innerHighlight)"
            />

            {/* ── Right Ear (Soft, rounded cartoon style) ── */}
            <path 
              ref={rightEarRef}
              style={{ transformOrigin: "78px 30px" }} 
              d="M 75 35 C 105 20, 110 50, 90 70 C 85 75, 70 70, 70 45 Z" 
              fill="url(#premiumGold)"
              filter="url(#innerHighlight)"
            />

            {/* ── Main Head Geometry (Chubby, cute proportions) ── */}
            <path 
              d="M 25 25 C 50 10, 50 10, 75 25 C 95 40, 95 65, 80 80 C 65 95, 35 95, 20 80 C 5 65, 5 40, 25 25 Z" 
              fill="url(#premiumGold)"
              filter="url(#innerHighlight)"
            />

            {/* ── Detailed Muzzle (Soft white puff) ── */}
            <path 
              d="M 32 60 C 32 45, 68 45, 68 60 C 72 80, 28 80, 32 60 Z" 
              fill="#ffffff" 
              opacity="0.25" 
            />
            
            {/* ── Nose (Cute button nose) ── */}
            <path 
              ref={noseRef}
              d="M 43 56 C 43 52, 57 52, 57 56 C 59 62, 53 66, 50 66 C 47 66, 41 62, 43 56 Z" 
              fill="#111111" 
            />
            <ellipse cx="48" cy="55" rx="3" ry="1.5" fill="#ffffff" opacity="0.6" />

            {/* ── Left Eye Group (Large, expressive) ── */}
            <g ref={eyeLeftRef} style={{ transformOrigin: "32px 42px" }}>
              <circle cx="32" cy="42" r="6" fill="#111111" />
              <circle cx="30" cy="40" r="2.5" fill="#ffffff" opacity="0.95"/>
              <circle cx="34" cy="44" r="1" fill="#ffffff" opacity="0.7"/>
            </g>

            {/* ── Right Eye Group (Large, expressive) ── */}
            <g ref={eyeRightRef} style={{ transformOrigin: "68px 42px" }}>
              <circle cx="68" cy="42" r="6" fill="#111111" />
              <circle cx="66" cy="40" r="2.5" fill="#ffffff" opacity="0.95"/>
              <circle cx="70" cy="44" r="1" fill="#ffffff" opacity="0.7"/>
            </g>

            {/* ── Secret Scratching Paw ── */}
            <g ref={pawRightRef} style={{ transformOrigin: '85px 50px', opacity: 0 }}>
              {/* Soft, plump cartoon paw */}
              <path 
                d="M 95 65 C 115 65, 120 40, 100 35 C 80 30, 80 55, 95 65 Z" 
                fill="url(#premiumGold)"
                filter="url(#innerHighlight)"
              />
              {/* Toe lines */}
              <path d="M 100 40 Q 95 45 100 50" stroke="#C98A00" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
              <path d="M 106 42 Q 101 47 106 52" stroke="#C98A00" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
            </g>

          </g>
        </svg>
      </div>
    </div>
  );
};

export default InteractiveNavbarMascot;
