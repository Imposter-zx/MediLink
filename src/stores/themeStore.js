import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Theme Store - Manages accessibility-focused theme preferences
 * 
 * Themes are designed for medical accessibility, not cosmetics:
 * - Light Comfort: Default warm, soft colors for daytime use
 * - Dark Medical: High contrast for night use and reduced eye strain
 * - High Contrast: Maximum readability for visually impaired users
 */

export const THEMES = {
  LIGHT_COMFORT: 'light-comfort',
  DARK_MEDICAL: 'dark-medical',
  HIGH_CONTRAST: 'high-contrast',
};

export const CONTRAST_MODES = {
  NORMAL: 'normal',
  HIGH: 'high',
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme
      theme: THEMES.LIGHT_COMFORT,
      
      // Contrast mode (for additional accessibility)
      contrastMode: CONTRAST_MODES.NORMAL,
      
      // Font size multiplier (1.0 = default, 1.2 = 20% larger)
      fontSizeMultiplier: 1.0,
      
      /**
       * Set theme and apply to document
       * @param {string} theme - One of THEMES values
       */
      setTheme: (theme) => {
        if (!Object.values(THEMES).includes(theme)) {
          console.warn(`Invalid theme: ${theme}`);
          return;
        }
        
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
        
        // Log for accessibility audit
        console.log(`[Theme] Changed to: ${theme}`);
      },
      
      /**
       * Set contrast mode
       * @param {string} mode - One of CONTRAST_MODES values
       */
      setContrastMode: (mode) => {
        if (!Object.values(CONTRAST_MODES).includes(mode)) {
          console.warn(`Invalid contrast mode: ${mode}`);
          return;
        }
        
        set({ contrastMode: mode });
        document.documentElement.setAttribute('data-contrast', mode);
      },
      
      /**
       * Adjust font size for elderly users
       * @param {number} multiplier - Font size multiplier (0.8 to 1.5)
       */
      setFontSizeMultiplier: (multiplier) => {
        const clamped = Math.max(0.8, Math.min(1.5, multiplier));
        set({ fontSizeMultiplier: clamped });
        document.documentElement.style.fontSize = `${clamped * 16}px`;
      },
      
      /**
       * Toggle between light and dark themes
       */
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === THEMES.LIGHT_COMFORT 
          ? THEMES.DARK_MEDICAL 
          : THEMES.LIGHT_COMFORT;
        get().setTheme(newTheme);
      },
      
      /**
       * Reset to default theme settings
       */
      resetTheme: () => {
        get().setTheme(THEMES.LIGHT_COMFORT);
        get().setContrastMode(CONTRAST_MODES.NORMAL);
        get().setFontSizeMultiplier(1.0);
      },
    }),
    {
      name: 'medilink-theme',
      storage: createJSONStorage(() => localStorage), // OK for non-sensitive UI preferences
      
      // Apply theme on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
          document.documentElement.setAttribute('data-contrast', state.contrastMode);
          document.documentElement.style.fontSize = `${state.fontSizeMultiplier * 16}px`;
        }
      },
    }
  )
);
