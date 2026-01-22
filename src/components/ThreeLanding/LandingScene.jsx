import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
  DepthOfField,
  ToneMapping,
  SSAO,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import Experience from './Experience';
import Overlay from './Overlay';

export default function LandingScene({ onEnter }) {
  const [ready, setReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [lowMotion, setLowMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLowMotion(prefersReducedMotion);
  }, []);

  useEffect(() => {
    // Simulate asset loading buffer
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    // Delay to allow exit animation
    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      <Suspense fallback={null}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 10], fov: 45 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            pixelRatio: Math.min(window.devicePixelRatio, 2),
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#020617']} />

          <Experience />

          <EffectComposer disableNormalPass multisampling={0}>
            {/* Softer Bloom for gentle glowing effects */}
            <Bloom
              luminanceThreshold={1.2}
              mipmapBlur
              intensity={0.6}
              radius={0.5}
              levels={6}
            />

            {/* Subtle Depth of Field */}
            <DepthOfField
              focusDistance={0.02}
              focalLength={0.08}
              bokehScale={2}
              height={480}
            />

            {/* Warm tone mapping */}
            <ToneMapping
              mode={ToneMappingMode.ACES_FILMIC}
              resolution={256}
              whitePoint={2.5}     /* Even softer white point */
              middleGrey={0.4}
              minLuminance={0.01}
              averageLuminance={0.6}
              adaptationRate={1.0}
            />

            {/* Very subtle chromatic aberration */}
            <ChromaticAberration
              offset={[0.0008, 0.0008]}
              radialModulation={false}
              modulationOffset={0}
            />

            {/* Minimal film grain */}
            <Noise opacity={0.02} premultiply blendFunction={BlendFunction.OVERLAY} />

            {/* Soft vignette */}
            <Vignette eskil={false} offset={0.2} darkness={0.7} />
          </EffectComposer>
        </Canvas>
      </Suspense>

      <Overlay onEnter={handleEnter} isExiting={isExiting} />
    </div>
  );
}
