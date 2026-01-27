import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Toggle/Switch Component
 * Accessible toggle switch for boolean settings
 */
const Toggle = ({ 
    id,
    label, 
    description,
    checked = false, 
    onChange,
    disabled = false,
    className 
}) => {
    return (
        <div className={cn("flex items-start gap-4", className)}>
            <button
                type="button"
                role="switch"
                id={id}
                aria-checked={checked}
                aria-labelledby={`${id}-label`}
                aria-describedby={description ? `${id}-description` : undefined}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/20",
                    checked ? "bg-primary" : "bg-input",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                        checked ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </button>
            <div className="flex-1">
                <label
                    id={`${id}-label`}
                    htmlFor={id}
                    className={cn(
                        "block text-base font-semibold text-foreground cursor-pointer",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    {label}
                </label>
                {description && (
                    <p
                        id={`${id}-description`}
                        className="text-sm text-muted-foreground mt-1"
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Toggle;
