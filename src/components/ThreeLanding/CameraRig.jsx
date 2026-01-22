import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Cinematic Camera Rig with smooth orbital movement and breathing effect
 */
export default function CameraRig() {
  const cameraRef = useRef();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!cameraRef.current) return;

    const t = state.clock.getElapsedTime();
    
    // Cinematic orbital path
    const radius = 10;
    const height = Math.sin(t * 0.15) * 1.5; // Slow vertical oscillation
    const angle = t * 0.08; // Slow rotation around scene
    
    // Calculate camera position
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = height;
    
    // Smooth camera movement with damping
    cameraRef.current.position.lerp(
      new THREE.Vector3(x, y, z),
      0.02 // Smooth damping
    );
    
    // Subtle breathing effect (zoom in/out)
    const breathe = Math.sin(t * 0.5) * 0.3;
    cameraRef.current.fov = 45 + breathe;
    cameraRef.current.updateProjectionMatrix();
    
    // Always look at center with slight offset
    targetRef.current.y = Math.sin(t * 0.3) * 0.5;
    cameraRef.current.lookAt(targetRef.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 10]}
      fov={45}
      near={0.1}
      far={1000}
    />
  );
}
