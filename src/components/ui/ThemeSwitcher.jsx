import React, { useEffect } from 'react';
import { useThemeStore, THEMES, CONTRAST_MODES } from '../../stores/themeStore';
import { Sun, Moon, Eye, Type } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../stores/authStore';

const ThemeSwitcher = () => {
    const { theme, setTheme, contrastMode, setContrastMode, fontSizeMultiplier, setFontSizeMultiplier } = useThemeStore();
    const { isAuthenticated } = useAuthStore();

    // Only show for authenticated users (part of user preferences)
    // Or show always if you want it on landing page too.
    // Diagram implies it's an accessibility feature available to all, but let's check
    // "User Preference -> Select Theme" in diagram 8.

    return (
        <div className="flex flex-col gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Accessibility</h3>
            
            {/* Theme Selection */}
            <div className="grid grid-cols-3 gap-2">
                <ThemeButton 
                    active={theme === THEMES.LIGHT_COMFORT} 
                    onClick={() => setTheme(THEMES.LIGHT_COMFORT)}
                    icon={Sun}
                    label="Comfort"
                />
                <ThemeButton 
                    active={theme === THEMES.DARK_MEDICAL} 
                    onClick={() => setTheme(THEMES.DARK_MEDICAL)}
                    icon={Moon}
                    label="Dark"
                />
                <ThemeButton 
                    active={theme === THEMES.HIGH_CONTRAST} 
                    onClick={() => setTheme(THEMES.HIGH_CONTRAST)}
                    icon={Eye}
                    label="Hi-Con"
                />
            </div>

            {/* Font Size Control */}
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFontSizeMultiplier(fontSizeMultiplier - 0.1)}
                    disabled={fontSizeMultiplier <= 0.8}
                >
                    A-
                </Button>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                    {Math.round(fontSizeMultiplier * 100)}%
                </span>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFontSizeMultiplier(fontSizeMultiplier + 0.1)}
                    disabled={fontSizeMultiplier >= 1.5}
                >
                    A+
                </Button>
            </div>
        </div>
    );
};

const ThemeButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-all text-xs font-medium gap-1",
            active 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
    >
        <Icon size={16} />
        {label}
    </button>
);

export default ThemeSwitcher;
