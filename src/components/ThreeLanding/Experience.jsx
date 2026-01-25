import { Float, Environment, Sparkles, Center, Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import CameraRig from './CameraRig';
import MedicalParticles from './MedicalParticles';
import PerformanceManager from './PerformanceManager';
import { qualityPresets } from './performancePresets';

// Enhanced DNA Strand with glowing connections and pulsing animations
const DNAStrand = ({ count = 40, radius = 2, height = 8 }) => {
  const groupRef = useRef();
  const barsRef = useRef([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3; // Rotate DNA
    }

    // Pulse animation for connection bars
    const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.5 + 0.5;
    barsRef.current.forEach((bar) => {
      if (bar) {
        bar.material.opacity = 0.2 + pulse * 0.3;
        bar.scale.y = 0.8 + pulse * 0.4;
      }
    });
  });

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 4; // 2 full turns
      const y = (t - 0.5) * height;
      
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      temp.push({ position: [x1, y, z1], color: '#8fbfa0' }); // Medical Sage
      temp.push({ position: [x2, y, z2], color: '#c5d8cc' }); // Light Sage/Mint
    }
    return temp;
  }, [count, radius, height]);

  return (
    <group ref={groupRef}>
      {/* Enhanced glowing connection bars */}
      {particles.map((p, i) => {
        if (i % 2 !== 0) return null;
        const pair = particles[i + 1];
        if (!pair) return null;

        const midpoint = [
          (p.position[0] + pair.position[0]) / 2,
          p.position[1],
          (p.position[2] + pair.position[2]) / 2,
        ];
        
        return (
          <mesh
            key={`bar-${i}`}
            ref={(el) => (barsRef.current[i] = el)}
            position={midpoint}
            rotation={[0, (i / count) * Math.PI * 4, 0]}
          >
            <boxGeometry args={[radius * 2, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#e0f2f1"
              emissive="#5eead4"
              emissiveIntensity={0.4}
              transparent
              opacity={0.25}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Glowing DNA nodes with enhanced materials */}
      <Instances range={count * 2}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          roughness={0.3}
          metalness={0.6}
          emissive="#5eead4"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
        {particles.map((data, i) => (
          <Instance key={i} position={data.position} color={data.color} />
        ))}
      </Instances>
    </group>
  );
};

// Volumetric light rays effect
const VolumetricLight = () => {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.getElapsedTime();
      lightRef.current.intensity = 3 + Math.sin(t * 0.5) * 0.5;
    }
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[10, 10, 10]}
        angle={0.2}
        penumbra={1}
        intensity={1.2}
        color="#d1e3d9" // Warm Sage White
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={[-10, 0, -10]}
        intensity={0.8}
        color="#c5d8cc"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, -5, 0]}
        intensity={0.6}
        color="#f0f5f2"
        distance={15}
        decay={2}
      />
    </>
  );
};

export default function Experience() {
  const groupRef = useRef();
  const [quality, setQuality] = useState('high');
  const preset = qualityPresets[quality];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <>
      {/* Performance monitoring */}
      <PerformanceManager onQualityChange={setQuality} />

      {/* Cinematic camera */}
      <CameraRig />

      {/* Environment and lighting */}
      <Environment preset="city" environmentIntensity={0.3} />
      
      {/* Warm Medical Lighting: Ivory/Sage hint */}
      <ambientLight intensity={0.6} color="#fcfaf2" />
      <VolumetricLight />

      {/* Main DNA visualization */}
      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
          <Center>
            <DNAStrand count={preset.dnaCount} />
          </Center>
        </Float>
      </group>

      {/* Floating medical particles */}
      <MedicalParticles count={preset.particleCount} />

      {/* Bio-Digital Sparkles */}
      <Sparkles
        count={preset.sparklesCount}
        scale={15}
        size={1.5}
        speed={0.15}
        opacity={0.25}
        color="#d1e3d9"
      />

      {/* Soft forest charcoal fog */}
      <fog attach="fog" args={['#1c2621', 12, 40]} />
    </>
  );
}
