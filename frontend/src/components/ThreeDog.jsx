import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// ─── Full Screen Layered Golden Particles ──────────────────────────────────────
export const GoldParticles = ({ count = 120, spreadX = 20, spreadY = 10, depth = 5 }) => {
  const mesh = useRef();
  
  // Create object pooling for matrix transforms
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Compute particle bounds ONCE on mount
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.003 + Math.random() / 400, 
        xFactor: -spreadX/2 + Math.random() * spreadX,
        yFactor: -spreadY/2 + Math.random() * spreadY,
        zFactor: -depth + Math.random() * (depth * 1.5),   
      });
    }
    return temp;
  }, [count, spreadX, spreadY, depth]);

  // Delta-clock driven animation, totally decoupled from React render loops
  useFrame((_, delta) => {
    particles.forEach((p, i) => {
      // Use time delta to ensure consistent speed regardless of framerate (60 vs 120hz)
      p.t += p.speed * (delta * 60); 
      
      const a = Math.cos(p.t) + Math.sin(p.t * 0.8) * 0.2;
      const b = Math.sin(p.t) + Math.cos(p.t * 1.5) * 0.2;
      const s = Math.max(0.5, Math.cos(p.t) * 3); 

      dummy.position.set(
        a * p.xFactor + Math.cos((p.t / 12) * p.factor) * 0.8 + (Math.sin(p.t) * p.factor) / 12,
        b * p.yFactor + Math.sin((p.t / 12) * p.factor) * 0.8 + (Math.cos(p.t * 1.5) * p.factor) / 12,
        p.zFactor + Math.cos((p.t / 10) * p.factor) / 4
      );
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]} renderOrder={-1}>
      <sphereGeometry args={[0.012, 12, 12]} />
      <meshStandardMaterial
        color="#F4B400"
        emissive="#F4B400"
        emissiveIntensity={1.2} // Softer emissive intensity for text legibility
        transparent
        opacity={0.4} // Softer opacity
        depthWrite={false}
      />
    </instancedMesh>
  );
};

// ─── Main dog scene ────────────────────────────────────────────────────────────
const ThreeDog = () => {
  const groupRef = useRef();          
  const floatRef = useRef();          
  const clockRef = useRef(0);

  // Load GLB 
  const { scene, animations } = useGLTF('/models/cute puppy 3d model_Clone1.glb');

  // Clone scene precisely once
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene]);

  // ── STRICT STATIC Auto-fit: compute bounding box ONCE ──────────────
  const { scale, offsetX, offsetY, offsetZ } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 4.0; // Fixed rigid target volume                       
    const s = targetSize / maxDim;

    // Center the asset on X and Z axis
    const x = -center.x * s;
    const z = -center.z * s;

    // ── Precise Y-Axis Translation to Prevent Bottom Clipping ──
    // -center.y * s places the absolute middle of the model at y=0.
    // We then translate upward by exactly half the scaled height (size.y / 2) * s 
    // This forces the lowest vertices (the paws) to sit exactly at y=0.
    // We add a cushion padding (0.15) to give it breathing room against the viewport fold.
    const padding = 0.15;
    const y = (-center.y * s) + ((size.y / 2) * s) + padding;

    return {
      scale: s,
      offsetX: x,
      offsetY: y,
      offsetZ: z,
    };
  }, [clonedScene]); // Only ever runs on initial clone creation

  // ── Animations ────────────────────────────────────────────────────────────────
  const { actions, names } = useAnimations(animations, clonedScene);

  useEffect(() => {
    if (!names.length) return;

    const idleName = names.find((n) => n.toLowerCase().includes('idle')) || names[0];
    const action = actions[idleName];
    
    if (action) {
      action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.4).play();
    }

    return () => {
      if (action) action.fadeOut(0.4);
    };
  }, [actions, names]);

  // ── Per-frame: float, breathing, mouse-follow (Delta Clock) ─────────────────
  useFrame((state, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    // Ambient floating based entirely on R3F internal delta time
    const floatY = Math.sin(t * 0.7) * 0.1;
    const breathe = 1 + Math.sin(t * 1.5) * 0.008;

    if (floatRef.current) {
      floatRef.current.position.y = floatY;
      floatRef.current.scale.y = breathe;
    }

    // Mouse-follow and Scroll-reaction — lerped using THREE.MathUtils instead of React state
    if (groupRef.current) {
      // 1. Cursor Reaction (Noticeably more curious and responsive)
      const targetY = state.pointer.x * (Math.PI / 10);   // Horizontal track
      const targetX = -state.pointer.y * (Math.PI / 16);  // Vertical track
      const targetZ = -state.pointer.x * (Math.PI / 36);  // Subtle body lean
      
      // 2. Scroll Reaction (Passive scroll reading without triggering React re-renders)
      const scrollY = window.scrollY || 0;
      // Slight downward head tilt based on scroll depth (max 10 degrees at 1000px scroll)
      const scrollTilt = Math.min(scrollY * 0.0003, Math.PI / 18); 

      // 3. 120Hz Damping 
      // Normalizing rotation damping to delta prevents jitter at 120hz
      const damping = 1 - Math.exp(-6 * delta);

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetY, 
        damping
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 
        targetX + scrollTilt, 
        damping
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, 
        targetZ, 
        damping
      );
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={floatRef}>
        <primitive
          object={clonedScene}
          scale={scale}
          // Shifted exactly 10% to the left for better visual flow with the text
          position={[offsetX - 0.4, offsetY, offsetZ]}
        />
      </group>
    </group>
  );
};

// Preload the asset
useGLTF.preload('/models/cute puppy 3d model_Clone1.glb');

export default ThreeDog;
