import {
  Float,
  Environment,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Experience() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          {/* Central abstract medical logo representation */}
          <mesh position={[0, 0, 0]}>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial
              color="#0f172a" // slate-900
              roughness={0.1}
              metalness={0.8}
              wireframe={true}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <icosahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial
              color="#cbd5e1" // slate-300
              roughness={0.2}
              metalness={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>
        </Float>

        {/* Floating particles/nodes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Float
            key={i}
            speed={1}
            rotationIntensity={2}
            floatIntensity={1.5}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 5,
            ]}
          >
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color="#3b82f6"
                emissive="#3b82f6"
                emissiveIntensity={2}
              />
            </mesh>
          </Float>
        ))}
      </group>

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </>
  );
}
