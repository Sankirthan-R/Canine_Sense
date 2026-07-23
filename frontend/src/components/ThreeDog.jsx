import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const ThreeDog = () => {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Auto-rotation base
    const baseRotationY = t / 8;
    const baseRotationX = Math.cos(t / 4) / 8;

    // Mouse tracking
    // pointer.x and y are normalized between -1 and 1
    const targetRotationY = baseRotationY + (state.pointer.x * 0.5);
    const targetRotationX = baseRotationX - (state.pointer.y * 0.5);

    // Smooth interpolation
    group.current.rotation.y += (targetRotationY - group.current.rotation.y) * 0.1;
    group.current.rotation.x += (targetRotationX - group.current.rotation.x) * 0.1;
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Hyper-premium metallic / obsidian orb */}
        <Sphere args={[1.5, 64, 64]} scale={[1, 0.85, 1.1]} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#1a1a1a"
            emissive="#443000"
            emissiveIntensity={0.3}
            roughness={0.15}
            metalness={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            reflectivity={1.0}
          />
        </Sphere>

        {/* Sleek metallic "Ears" / Nodes */}
        <Sphere args={[0.25, 32, 32]} position={[-0.8, 1.1, 0.5]}>
          <meshPhysicalMaterial color="#F4B400" roughness={0.1} metalness={1.0} clearcoat={1.0} />
        </Sphere>
        <Sphere args={[0.25, 32, 32]} position={[0.8, 1.1, 0.5]}>
          <meshPhysicalMaterial color="#F4B400" roughness={0.1} metalness={1.0} clearcoat={1.0} />
        </Sphere>

        {/* Orbiting particles (Data points) */}
        <Particles count={60} />
      </Float>
    </group>
  );
};

const Particles = ({ count }) => {
  const mesh = useRef();

  const dummy = new THREE.Object3D();
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -2 + Math.random() * 4;
      const yFactor = -2 + Math.random() * 4;
      const zFactor = -2 + Math.random() * 4;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshStandardMaterial color="#F4B400" emissive="#F4B400" emissiveIntensity={2} />
    </instancedMesh>
  );
};

export default ThreeDog;
