import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CapsuleIntro from '../components/intro/CapsuleIntro';

export default function IntroPage() {
  const navigate = useNavigate();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Force set session flag immediately to avoid re-play on refresh from dashboard
    sessionStorage.setItem('medilink_intro_played', 'true');
  }, []);

  const handleAnimationFinished = () => {
    setFading(true);
    // Smooth transition delay
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1000);
  };

  return (
    <div className={`transition-opacity duration-1000 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <CapsuleIntro onFinished={handleAnimationFinished} />
    </div>
  );
}
