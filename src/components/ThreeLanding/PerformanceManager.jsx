import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Performance Manager - Monitors FPS and adjusts quality dynamically
 * Enhanced with Battery and GPU tier detection awareness.
 */
export default function PerformanceManager({ onQualityChange }) {
  const { gl } = useThree();
  const fpsRef = useRef([]);
  const lastTimeRef = useRef(performance.now());
  const [quality, setQuality] = useState('high');

  // Detect device capabilities & battery status
  useEffect(() => {
    const detectHardware = async () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        
        let initialQuality = 'high';
        if (isMobile || isLowEnd) {
          initialQuality = 'medium';
        }
        
        // Battery Status API Check
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                if (battery.level < 0.2 && !battery.charging) {
                    console.log('[Performance] Low battery detected, downgrading quality');
                    initialQuality = 'low';
                }
            } catch {
                // Ignore battery API errors
            }
        }

        setQuality(initialQuality);
        onQualityChange?.(initialQuality);
        
        // Set pixel ratio based on device
        gl.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    };

    detectHardware();
  }, [gl, onQualityChange]);

  // Monitor FPS
  useFrame(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    
    // Prevent divide by zero
    if (delta > 0) {
        const fps = 1000 / delta;
        fpsRef.current.push(fps);
    }
    
    // Keep only last 60 frames
    if (fpsRef.current.length > 60) {
      fpsRef.current.shift();
    }
    
    // Check average FPS every 60 frames
    if (fpsRef.current.length === 60) {
      const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / 60;
      
      // Adjust quality based on FPS
      if (avgFps < 30 && quality !== 'low') {
        setQuality('low');
        onQualityChange?.('low');
        console.log('Performance: Switching to LOW quality');
      } else if (avgFps < 45 && quality === 'high') {
        setQuality('medium');
        onQualityChange?.('medium');
        console.log('Performance: Switching to MEDIUM quality');
      } else if (avgFps > 55 && quality !== 'high') {
        setQuality('high');
        onQualityChange?.('high');
        console.log('Performance: Switching to HIGH quality');
      }
      
      fpsRef.current = [];
    }
    
    lastTimeRef.current = now;
  });

  return null;
}
