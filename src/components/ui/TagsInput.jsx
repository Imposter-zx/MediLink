import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * TagsInput Component
 * Multi-tag input for medical data like allergies and conditions
 */
const TagsInput = ({
    id,
    label,
    description,
    placeholder = "Type and press Enter",
    tags = [],
    onChange,
    maxTags = 20,
    disabled = false,
    className
}) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag on backspace if input is empty
            removeTag(tags.length - 1);
        }
    };

    const addTag = (tag) => {
        setError('');
        
        if (tags.length >= maxTags) {
            setError(`Maximum ${maxTags} tags allowed`);
            return;
        }
        
        // Check for duplicates (case-insensitive)
        if (tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
            setError('This tag already exists');
            return;
        }
        
        onChange([...tags, tag]);
        setInputValue('');
    };

    const removeTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(newTags);
    };

    return (
        <div className={cn("space-y-2", className)}>
            <label
                htmlFor={id}
                className={cn(
                    "block text-base font-semibold text-foreground",
                    disabled && "opacity-50"
                )}
            >
                {label}
            </label>
            
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            
            <div
                className={cn(
                    "min-h-[56px] p-3 rounded-xl border-2 bg-background",
                    "focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary",
                    "transition-all duration-200",
                    error ? "border-destructive" : "border-input",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                {/* Tags Display */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                disabled={disabled}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label={`Remove ${tag}`}
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
                
                {/* Input */}
                <input
                    type="text"
                    id={id}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    disabled={disabled}
                    className="w-full bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
                    aria-label={label}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            </div>
            
            {error && (
                <p id={`${id}-error`} className="text-sm text-destructive font-medium" role="alert">
                    {error}
                </p>
            )}
            
            <p className="text-xs text-muted-foreground">
                Press Enter to add • {tags.length}/{maxTags} tags
            </p>
        </div>
    );
};

export default TagsInput;
