import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ThreeDog, { GoldParticles } from './ThreeDog';

// ── Garbage Collection & Memory Management ────────────────────────────────────
// A utility component that hooks into the R3F lifecycle to manually clean up 
// the WebGL buffers and geometries when the canvas unmounts, preventing memory leaks.
const SceneCleanup = () => {
  const { scene, gl } = useThree();

  useEffect(() => {
    return () => {
      // Safely traverse the scene graph upon unmount
      scene.traverse((object) => {
        if (!object.isMesh) return;

        // Deallocate Geometry
        if (object.geometry) {
          object.geometry.dispose();
        }

        // Deallocate Materials and Textures
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            // Dispose of maps inside the material
            for (const key in material) {
              const value = material[key];
              if (value && typeof value.dispose === 'function' && value instanceof THREE.Texture) {
                value.dispose();
              }
            }
            material.dispose();
          });
        }
      });
      // Force renderer cleanup
      gl.dispose();
    };
  }, [scene, gl]);

  return null;
};

// ── Main Hero Canvas ──────────────────────────────────────────────────────────
const MainHeroCanvas = () => {
  return (
    // The container strictly enforces a rigid aspect-square max-width to prevent layout shifting
    <div className="w-full max-w-[550px] aspect-square mx-auto lg:ml-auto lg:mr-0 relative">
      <Canvas
        shadows
        // Transparent context removes any visual seam boundaries against the parent background
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        // Framed vertically to provide clean visibility from head to paws without overlap, with extra headroom for floating
        camera={{ position: [0, 1.4, 7.5], fov: 42, near: 0.1, far: 100 }}
        className="w-full h-full"
      >
        <SceneCleanup />

        {/* ── PBR Cinematic Lighting ── */}
        <ambientLight intensity={0.5} color="#fff4d6" />
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.4}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.1}
          shadow-camera-far={30}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        {/* Soft golden rim light */}
        <directionalLight position={[-5, 3, -4]} intensity={1.5} color="#F4B400" />
        {/* Cool fill light */}
        <directionalLight position={[5, -2, -3]} intensity={0.3} color="#c8d8ff" />
        {/* Subtle gold bounce from floor */}
        <pointLight position={[0, -2, 2]} intensity={5} color="#F4B400" distance={15} decay={2} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <ThreeDog />
          {/* Particles moved to global FullScreenParticles canvas in Hero.jsx to span entire section */}
          <ContactShadows
            position={[0, 0, 0]} 
            opacity={0.35}
            scale={16}
            blur={3}
            far={5}
            color="#000000"
          />
          {/* Static controls strictly to lock the camera target to the dog's chest height, ensuring plenty of headroom */}
          <OrbitControls 
            target={[0, 1.4, 0]} 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MainHeroCanvas;
