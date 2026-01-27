import React from 'react';
import { Shield, Heart, Activity, ArrowRight, Lock } from 'lucide-react';
import Button from '../ui/Button';
import DashboardPreview from './DashboardPreview';
import { motion } from 'framer-motion';

const MedicalLanding = ({ onEnter }) => {
  const MotionDiv = motion.div;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden font-sans transition-colors duration-300">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center py-12">
        {/* Trusted Badge */}
        <MotionDiv 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border shadow-sm rounded-full mb-8"
        >
            <Shield className="text-primary" size={16} />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trusted Healthcare Platform</span>
        </MotionDiv>

        {/* Hero Section */}
        <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl space-y-6"
        >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Connected Care for a <span className="text-primary">Healthier Future.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                MediLink bridges the gap between patients, healthcare providers, and pharmacies with a secure, real-time clinical network built on FHIR standards.
            </p>
        </MotionDiv>

        {/* Primary Actions */}
        <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mt-10 mb-16"
        >
            <Button 
                onClick={onEnter} 
                className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
                Access Dashboard
                <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button 
                variant="outline" 
                className="h-14 px-10 rounded-2xl text-lg font-bold border-2"
                onClick={onEnter}
            >
                Sign In
            </Button>
        </MotionDiv>

        {/* Security & Trust Icons */}
        <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-8 mb-20"
        >
            <div className="flex items-center gap-2 text-muted-foreground/60">
                <Lock size={18} />
                <span className="text-sm font-medium">End-to-end Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
                <Heart size={18} />
                <span className="text-sm font-medium">Patient-Centric Design</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
                <Activity size={18} />
                <span className="text-sm font-medium">Real-time Clinical Data</span>
            </div>
        </MotionDiv>

        {/* Dashboard Preview / Interface Hint */}
        <MotionDiv 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full"
        >
            <DashboardPreview />
        </MotionDiv>

        {/* Footer Reassurance */}
        <div className="mt-12 pt-8 border-t border-border w-full flex flex-col items-center">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Your medical data is encrypted and securely protected under HIPAA-compliant standards.
            </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalLanding;
