import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Slider Component
 * Accessible range slider with visual feedback
 */
const Slider = ({
    id,
    label,
    description,
    value = 1,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    formatValue = (v) => v,
    disabled = false,
    className
}) => {
    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-between">
                <label
                    htmlFor={id}
                    className={cn(
                        "text-base font-semibold text-foreground",
                        disabled && "opacity-50"
                    )}
                >
                    {label}
                </label>
                <span className="text-base font-bold text-primary">
                    {formatValue(value)}
                </span>
            </div>
            
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            
            <div className="relative">
                <input
                    type="range"
                    id={id}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    disabled={disabled}
                    className={cn(
                        "w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer",
                        "focus:outline-none focus:ring-4 focus:ring-primary/20",
                        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg",
                        "[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={label}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    aria-valuetext={formatValue(value)}
                />
                
                {/* Visual track fill */}
                <div
                    className="absolute top-0 left-0 h-3 bg-primary/30 rounded-lg pointer-events-none"
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatValue(min)}</span>
                <span>{formatValue(max)}</span>
            </div>
        </div>
    );
};

export default Slider;
