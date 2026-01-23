import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * Helps with mobile-first design and accessibility
 */

/**
 * Hook to check if screen matches a media query
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e) => {
      setMatches(e.matches);
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);
  
  return matches;
};

/**
 * Predefined breakpoint hooks for common use cases
 */

export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

export const useIsTablet = () => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
};

export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1025px)');
};

export const useIsSmallScreen = () => {
  return useMediaQuery('(max-width: 640px)');
};

export const useIsLargeScreen = () => {
  return useMediaQuery('(min-width: 1280px)');
};

/**
 * Hook to detect if user prefers reduced motion (accessibility)
 * @returns {boolean} Whether user prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Hook to detect if user prefers dark color scheme
 * @returns {boolean} Whether user prefers dark mode
 */
export const usePrefersDarkMode = () => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};

/**
 * Hook to detect if user prefers high contrast
 * @returns {boolean} Whether user prefers high contrast
 */
export const usePrefersHighContrast = () => {
  return useMediaQuery('(prefers-contrast: high)');
};

/**
 * Hook to get current breakpoint name
 * @returns {string} Breakpoint name ('mobile', 'tablet', 'desktop')
 */
export const useBreakpoint = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

/**
 * Hook to detect device orientation
 * @returns {string} Orientation ('portrait' or 'landscape')
 */
export const useOrientation = () => {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
};
