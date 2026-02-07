import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

function CapsuleModel({ onFinished }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/pill_capsule.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const animationName = 'intro_capsule';
    if (actions[animationName]) {
      const action = actions[animationName];
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();

      const duration = action.getClip().duration || 5;
      
      const timer = setTimeout(() => {
        if (onFinished) onFinished();
      }, duration * 1000);

      return () => clearTimeout(timer);
    } else {
      console.warn(`Animation "${animationName}" not found.`);
      const timer = setTimeout(() => {
        if (onFinished) onFinished();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actions, onFinished]);

  return (
    <group ref={group} dispose={null} scale={1.8}>
      <primitive object={nodes.Scene || nodes.RootNode || Object.values(nodes)[0]} />
    </group>
  );
}

const Scene = ({ onFinished }) => {
  const cameraRef = useRef();

  useFrame((state) => {
    if (cameraRef.current) {
      // Smoother cinematic dolly-in
      cameraRef.current.position.z = THREE.MathUtils.lerp(
        cameraRef.current.position.z,
        5.5,
        0.008
      );
    }
  });

  return (
    <>
      <color attach="background" args={['#080a0f']} />
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 12]} fov={40} />
      
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#4e8cff" castShadow />
      <pointLight position={[-10, -10, -5]} intensity={1.5} color="#2b59ff" />
      <rectAreaLight width={5} height={5} intensity={5} position={[0, 0, 5]} color="#ffffff" />
      
      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
          <CapsuleModel onFinished={onFinished} />
        </Float>
        
        <Sparkles count={60} scale={12} size={3} speed={0.5} opacity={0.3} color="#4e8cff" />
        <Environment preset="night" />
        
        {/* Post-processing for Premium Feel */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.4} 
          />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </Suspense>
    </>
  );
};

export default function CapsuleIntro({ onFinished }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#080a0f] z-[9999]">
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: "high-performance",
          toneMapping: THREE.ReinhardToneMapping,
        }}
        dpr={[1, 2]}
      >
        <Scene onFinished={onFinished} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/pill_capsule.glb');
