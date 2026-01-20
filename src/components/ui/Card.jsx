import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "bg-card text-card-foreground rounded-2xl border border-border shadow-sm transition-all duration-200",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className }) => (
    <div className={cn("px-6 py-4 border-b border-border/50", className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
    <h3 className={cn("text-lg font-semibold tracking-tight", className)}>{children}</h3>
);

export const CardContent = ({ children, className }) => (
    <div className={cn("p-6", className)}>{children}</div>
);

export default Card;
