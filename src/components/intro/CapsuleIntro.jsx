import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function CapsuleModel({ onFinished }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/pill_capsule.glb');
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    const animationName = 'intro_capsule';
    if (actions[animationName]) {
      const action = actions[animationName];
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();

      // Get animation duration or fallback to 5 seconds
      const duration = action.getClip().duration || 5;
      
      const timer = setTimeout(() => {
        if (onFinished) onFinished();
      }, duration * 1000);

      return () => clearTimeout(timer);
    } else {
      console.warn(`Animation "${animationName}" not found. Falling back to default delay.`);
      const timer = setTimeout(() => {
        if (onFinished) onFinished();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actions, onFinished]);

  return (
    <group ref={group} dispose={null} scale={1.5}>
      <primitive object={nodes.Scene || nodes.RootNode || Object.values(nodes)[0]} />
    </group>
  );
}

const Scene = ({ onFinished }) => {
  const cameraRef = useRef();

  useFrame((state) => {
    if (cameraRef.current) {
      // Subtle dolly-in effect
      cameraRef.current.position.z = THREE.MathUtils.lerp(
        cameraRef.current.position.z,
        6,
        0.005
      );
    }
  });

  return (
    <>
      <color attach="background" args={['#0c0f14']} />
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={45} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#4e8cff" />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#2b59ff" />
      
      <React.Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <CapsuleModel onFinished={onFinished} />
        </Float>
        <Sparkles count={40} scale={10} size={2} speed={0.4} opacity={0.2} color="#4e8cff" />
        <Environment preset="city" />
      </React.Suspense>
    </>
  );
};

export default function CapsuleIntro({ onFinished }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#0c0f14] z-[9999]">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Scene onFinished={onFinished} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/pill_capsule.glb');
