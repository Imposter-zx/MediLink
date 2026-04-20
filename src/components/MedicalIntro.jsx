import React, { useEffect, useState } from 'react';



const MedicalIntro = ({ onComplete }) => {
  const [stage, setStage] = useState('entry'); // entry, convergence, activation, exit

  useEffect(() => {
    // Stage timings
    const timers = [
      setTimeout(() => setStage('convergence'), 1200),
      setTimeout(() => setStage('activation'), 2400),
      setTimeout(() => setStage('exit'), 3600),
      setTimeout(() => onComplete(), 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Capsule colors
  const teal = "#2dd4bf";
  const softBlue = "#60a5fa";
  const lightMint = "#99f6e4";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white to-teal-50"
    >
      {/* Step 1 & 2: Moving and Converging Capsules */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <AnimatePresence>
          {stage === 'entry' && (
            <>
              {/* Top Capsule */}
              <motion.div
                initial={{ y: -500, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute"
              >
                <Capsule color={teal} rotation={0} />
              </motion.div>
              {/* Bottom Capsule */}
              <motion.div
                initial={{ y: 500, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute"
              >
                <Capsule color={softBlue} rotation={180} />
              </motion.div>
              {/* Left Capsule */}
              <motion.div
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute"
              >
                <Capsule color={lightMint} rotation={-90} />
              </motion.div>
              {/* Right Capsule */}
              <motion.div
                initial={{ x: 500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute"
              >
                <Capsule color={teal} rotation={90} />
              </motion.div>
            </>
          )}

          {(stage === 'convergence' || stage === 'activation') && (
            <motion.div
              layoutId="main-capsule"
              initial={{ scale: 0.8, rotate: 45 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0] 
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 300, damping: 20 },
                rotate: { duration: 0.8 },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              className="relative"
            >
              {/* The Joined Capsule */}
              <div className="relative">
                <motion.div
                  animate={stage === 'activation' ? { filter: "drop-shadow(0 0 15px rgba(45, 212, 191, 0.6))" } : {}}
                  className="relative z-10"
                >
                    <LargeCapsule color1={teal} color2={softBlue} split={stage === 'exit'} />
                </motion.div>
                
                {/* Pulse Glow */}
                {stage === 'convergence' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-teal-400 rounded-full blur-xl"
                  />
                )}

                {/* Scan Line */}
                {stage === 'activation' && (
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-[-20%] right-[-20%] h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent blur-[1px] z-20"
                  />
                )}
              </div>
            </motion.div>
          )}

          {stage === 'exit' && (
             <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.8 }}
              className="absolute flex flex-col items-center justify-center"
             >
                <div className="relative">
                    <motion.div animate={{ y: -50 }} transition={{ duration: 0.5 }}>
                        <CapsuleHalf color={teal} pos="top" />
                    </motion.div>
                    <motion.div animate={{ y: 50 }} transition={{ duration: 0.5 }}>
                        <CapsuleHalf color={softBlue} pos="bottom" />
                    </motion.div>
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 4, opacity: 1 }}
                        className="absolute inset-0 bg-white rounded-full blur-3xl"
                    />
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Reveal */}
      <AnimatePresence>
        {(stage === 'activation' || stage === 'convergence') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-12 text-center"
          >
            <p className="text-teal-700 font-medium tracking-wide">
              {stage === 'convergence' ? "Synchronizing systems..." : "Preparing your secure medical environment..."}
            </p>
            <div className="flex justify-center mt-2 gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-teal-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Capsule = ({ color, rotation }) => (
  <div style={{ transform: `rotate(${rotation}deg)` }} className="w-8 h-16 relative">
    <div className="absolute top-0 w-full h-1/2 rounded-t-full" style={{ backgroundColor: color }} />
    <div className="absolute bottom-0 w-full h-1/2 rounded-b-full bg-slate-100" />
  </div>
);

const LargeCapsule = ({ color1, color2 }) => (
  <div className="w-16 h-32 relative">
    <div className="w-full h-1/2 rounded-t-full" style={{ backgroundColor: color1 }} />
    <div className="w-full h-1/2 rounded-b-full" style={{ backgroundColor: color2 }} />
    <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2" />
  </div>
);


const CapsuleHalf = ({ color, pos }) => (
  <div 
    className={`w-16 h-16 ${pos === 'top' ? 'rounded-t-full' : 'rounded-b-full'}`} 
    style={{ backgroundColor: color }} 
  />
);

export default MedicalIntro;
