
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import Experience from './Experience';
import Overlay from './Overlay';

export default function LandingScene({ onEnter }) {
  const [ready, setReady] = useState(false);

  // Simple loading simulation or just waiting for initial mount
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500); // Small buffer
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden">
      <Suspense fallback={null}>
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={['#f8fafc']} /> {/* slate-50 */}
          <Experience />
        </Canvas>
      </Suspense>
      
      {/* Show Overlay always, but maybe fade it in once ready if desired, 
          for now we show immediately but Overlay has its own intro animation */}
      <Overlay onEnter={onEnter} />
      
      {/* Remove the static 'Loading Assets' from overlay if we want dynamic loading state handling here */}
    </div>
  );
}
