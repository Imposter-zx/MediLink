
import { motion } from 'framer-motion';

export default function Overlay({ onEnter }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
          MediLink
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-light mb-8 max-w-md mx-auto">
          The Future of Healthcare Management
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, delay: 1 }}
        onClick={onEnter}
        className="pointer-events-auto px-10 py-4 bg-slate-900 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        aria-label="Enter Application"
      >
        Enter App
      </motion.button>
      
      <div className="absolute bottom-8 text-sm text-slate-400 font-medium">
        Loading Assets...
      </div>
    </div>
  );
}
