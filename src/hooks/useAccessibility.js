import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { usePrefersReducedMotion, usePrefersHighContrast } from './useMediaQuery';

/**
 * Custom hook for accessibility features
 * Automatically applies user preferences and system settings
 */
export const useAccessibility = () => {
  const { 
    theme, 
    contrastMode, 
    fontSizeMultiplier,
    setContrastMode,
    setFontSizeMultiplier,
  } = useThemeStore();
  
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersHighContrast = usePrefersHighContrast();
  
  // Auto-apply high contrast if system preference detected
  useEffect(() => {
    if (prefersHighContrast && contrastMode !== 'high') {
      console.log('[Accessibility] System high contrast detected, applying...');
      setContrastMode('high');
    }
  }, [prefersHighContrast, contrastMode, setContrastMode]);
  
  // Apply reduced motion class to document
  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [prefersReducedMotion]);
  
  /**
   * Increase font size (for elderly users)
   */
  const increaseFontSize = () => {
    const newSize = Math.min(fontSizeMultiplier + 0.1, 1.5);
    setFontSizeMultiplier(newSize);
  };
  
  /**
   * Decrease font size
   */
  const decreaseFontSize = () => {
    const newSize = Math.max(fontSizeMultiplier - 0.1, 0.8);
    setFontSizeMultiplier(newSize);
  };
  
  /**
   * Reset font size to default
   */
  const resetFontSize = () => {
    setFontSizeMultiplier(1.0);
  };
  
  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  const announce = (message, priority = 'polite') => {
    const announcer = document.getElementById('a11y-announcer');
    
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  };
  
  return {
    theme,
    contrastMode,
    fontSizeMultiplier,
    prefersReducedMotion,
    prefersHighContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    announce,
  };
};

/**
 * Hook to manage keyboard navigation
 * @param {Object} options - Configuration options
 * @returns {Object} Keyboard navigation helpers
 */
export const useKeyboardNavigation = (options = {}) => {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
  } = options;
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
        case 'ArrowUp':
          onArrowUp?.();
          break;
        case 'ArrowDown':
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          onArrowRight?.();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);
};

/**
 * Hook to manage focus trap (for modals)
 * @param {React.RefObject} containerRef - Ref to container element
 * @param {boolean} isActive - Whether trap is active
 */
export const useFocusTrap = (containerRef, isActive) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element on mount
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef, isActive]);
};
