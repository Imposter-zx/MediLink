import { useEffect } from 'react';
import { useThemeStore, CONTRAST_MODES } from '../stores/themeStore';

/**
 * Accessibility Hook
 * 
 * Synchronizes accessibility preferences from store to the DOM.
 * Call this once in the root App component.
 */
export const useAccessibility = () => {
  const { theme, contrastMode, fontSizeMultiplier } = useThemeStore();

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply high contrast if enabled
    document.documentElement.setAttribute('data-contrast', contrastMode);
    
    // Apply font scaling
    const baseSize = 16 * fontSizeMultiplier;
    document.documentElement.style.fontSize = `${baseSize}px`;
    
  }, [theme, contrastMode, fontSizeMultiplier]);
  
  return { theme, contrastMode, fontSizeMultiplier };
};
