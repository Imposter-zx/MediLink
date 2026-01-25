import { motion as Motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Overlay({ onEnter, isExiting }) {
  const titleRef = useRef(null);
  const crossControls = useAnimation();
  const titleControls = useAnimation();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Cinematic intro sequence with framer-motion
    const runIntroSequence = async () => {
      // Animate medical cross
      await crossControls.start({
        scale: [0, 1.2, 1],
        rotate: [180, -10, 0],
        opacity: [0, 1],
        transition: {
          duration: 1.2,
          ease: [0.6, 0.01, 0.05, 0.95],
        },
      });

      // Title glitch effect
      await titleControls.start({
        x: [-10, 10, -5, 5, 0],
        opacity: [0, 0.5, 1],
        transition: {
          duration: 0.8,
          ease: 'easeOut',
        },
      });

      // Show button
      setShowButton(true);
    };

    runIntroSequence();

    // Continuous subtle glitch for title
    const glitchInterval = setInterval(() => {
      if (titleRef.current && !isExiting) {
        titleControls.start({
          x: [0, 2, -2, 0],
          transition: { duration: 0.15 },
        });
      }
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, [crossControls, titleControls, isExiting]);

  // Exit animation
  useEffect(() => {
    if (isExiting) {
      document.querySelector('.overlay-content')?.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.8)' },
        ],
        {
          duration: 800,
          easing: 'ease-in',
          fill: 'forwards',
        }
      );
    }
  }, [isExiting]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50 overlay-content">
      {/* Sci-Fi HUD Frame */}
      <div className="absolute top-0 left-0 w-full h-full p-6 md:p-10 box-border opacity-20 pointer-events-none">
        <div className="border border-slate-700 w-full h-full rounded-2xl relative">
          {/* Corner accents with sage colors */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 -mt-0.5 -ml-0.5 animate-pulse" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 -mt-0.5 -mr-0.5 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/40 -mb-0.5 -ml-0.5 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 -mb-0.5 -mr-0.5 animate-pulse" />
          
          {/* Animated corner lines with softer colors */}
          <Motion.div
            className="absolute top-0 left-8 w-16 h-0.5 bg-gradient-to-r from-teal-400/70 to-transparent"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Motion.div
            className="absolute top-0 right-8 w-16 h-0.5 bg-gradient-to-l from-teal-400/70 to-transparent"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
      </div>

      {/* Warm animated scan lines effect */}
      <Motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #8fbfa0 2px, #8fbfa0 4px)',
        }}
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Medical Cross Icon */}
      <Motion.div
        animate={crossControls}
        initial={{ opacity: 0, scale: 0 }}
        className="mb-8"
      >
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          {/* Vertical bar with warm sage gradient */}
          <Motion.div
            className="absolute left-1/2 top-0 w-2 h-full bg-gradient-to-b from-primary/80 to-primary transform -translate-x-1/2 shadow-md shadow-primary/20"
            animate={{ scaleY: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Horizontal bar with warm sage gradient */}
          <Motion.div
            className="absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-primary/80 to-primary transform -translate-y-1/2 shadow-md shadow-primary/20"
            animate={{ scaleX: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
          {/* Subtle pulsing glow effect */}
          <Motion.div
            className="absolute inset-0 bg-primary/10 blur-xl rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </Motion.div>

      {/* Title with glitch effect */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: 'circOut', delay: 0.3 }}
        className="text-center relative z-10 mb-4"
      >
        <Motion.h1
          ref={titleRef}
          animate={titleControls}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter select-none relative"
          style={{
            textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-sage-100 to-sage-300" style={{ backgroundImage: 'linear-gradient(to bottom, #ffffff, #d1e3d9, #8fbfa0)' }}>
            MEDILINK
          </span>
          {/* Subtle ivory accents layer */}
          <Motion.span
            className="absolute inset-0 bg-clip-text text-transparent bg-white/10"
            style={{ transform: 'translate(1px, 1px)' }}
          >
            MEDILINK
          </Motion.span>
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
          className="text-primary uppercase tracking-[0.5em] text-xs md:text-sm font-bold mt-4"
        >
          Healthcare Connectivity Platform
        </Motion.p>
      </Motion.div>

      {/* System status indicators with sage colors */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="flex gap-4 mb-12 text-xs font-mono text-primary"
      >
        <div className="flex items-center gap-2">
          <Motion.div
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>SYSTEM READY</span>
        </div>
        <div className="flex items-center gap-2">
          <Motion.div
            className="w-2 h-2 bg-primary/60 rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <span>SECURE CONNECTION</span>
        </div>
      </Motion.div>

      {/* Enhanced CTA Button */}
      {showButton && (
        <Motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.02,
            textShadow: '0px 0px 5px rgba(255, 255, 255, 0.3)',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5 }}
          onClick={onEnter}
          className="pointer-events-auto group relative px-12 py-4 bg-transparent overflow-hidden"
        >
          {/* Warm background */}
          <div className="absolute inset-0 w-full h-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300" />
          
          {/* Border with skew and primary Sage colors */}
          <div className="absolute inset-0 w-full h-full border-2 border-primary/30 group-hover:border-primary/50 transition-colors duration-300 transform skew-x-[-12deg]">
            {/* Corner highlights */}
            <Motion.div
              className="absolute top-0 left-0 w-3 h-3 bg-primary/40 group-hover:bg-primary/60 transition-colors"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Motion.div
              className="absolute bottom-0 right-0 w-3 h-3 bg-primary/40 group-hover:bg-primary/60 transition-colors"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>

          {/* Subtle hover overlay */}
          <Motion.div
            className="absolute inset-0 w-full h-0.5 bg-primary/20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <span className="relative z-10 text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-3">
            <span>Enter Experience</span>
            <Motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </Motion.svg>
          </span>
        </Motion.button>
      )}

      {/* Version info */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 text-[10px] text-slate-500 font-mono tracking-widest uppercase"
      >
        v1.0.0 // Medical Platform // Access Granted
      </Motion.div>

      {/* Floating particle effects with sage colors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{
              // eslint-disable-next-line react-hooks/purity
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: -10,
              opacity: 0,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1080,
              opacity: [0, 0.3, 0],
            }}
            transition={{
              // eslint-disable-next-line react-hooks/purity
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              // eslint-disable-next-line react-hooks/purity
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
