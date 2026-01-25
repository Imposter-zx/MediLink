import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Floating Medical Particles - Pills, Capsules, and Medical Crosses
 */
export default function MedicalParticles({ count = 30 }) {
  const groupRef = useRef();

  // Generate particle data
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      const type = ['pill', 'capsule', 'cross'][Math.floor(Math.random() * 3)];
      const position = [
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 20,
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 15,
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 20,
      ];
      const velocity = [
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 0.02,
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 0.02,
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 0.02,
      ];
      const rotation = [
        // eslint-disable-next-line react-hooks/purity
        Math.random() * Math.PI * 2,
        // eslint-disable-next-line react-hooks/purity
        Math.random() * Math.PI * 2,
        // eslint-disable-next-line react-hooks/purity
        Math.random() * Math.PI * 2,
      ];
      // eslint-disable-next-line react-hooks/purity
      const scale = 0.3 + Math.random() * 0.4;
      // eslint-disable-next-line react-hooks/purity
      const color = Math.random() > 0.5 ? '#8fbfa0' : '#c5d8cc'; // Sage or Light Sage/Mint
      
      temp.push({ type, position, velocity, rotation, scale, color });
    }
    return temp;
  }, [count]);

  // Animate particles
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.children.forEach((child, i) => {
      const particle = particles[i];
      
      // Float movement
      child.position.x += particle.velocity[0];
      child.position.y += particle.velocity[1];
      child.position.z += particle.velocity[2];
      
      // Rotation
      child.rotation.x += delta * 0.5;
      child.rotation.y += delta * 0.3;
      
      // Boundary check - wrap around
      ['x', 'y', 'z'].forEach((axis, idx) => {
        const limit = idx === 1 ? 7.5 : 10;
        if (Math.abs(child.position[axis]) > limit) {
          child.position[axis] *= -1;
        }
      });
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <MedicalParticle key={i} {...p} />
      ))}
    </group>
  );
}

function MedicalParticle({ type, position, rotation, scale, color }) {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {type === 'pill' && (
        <>
          <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            roughness={0.5}
            metalness={0.4}
            transparent
            opacity={0.5}
          />
        </>
      )}
      {type === 'capsule' && (
        <>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.5}
            metalness={0.4}
            transparent
            opacity={0.45}
          />
        </>
      )}
      {type === 'cross' && (
        <group>
          {/* Vertical bar */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.6, 0.1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
          {/* Horizontal bar */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.1, 0.1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
        </group>
      )}
    </mesh>
  );
}
