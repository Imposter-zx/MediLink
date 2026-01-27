import React, { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';

/**
 * FileUpload Component
 * Profile picture upload with preview and validation
 */
const FileUpload = ({
    id,
    label,
    description,
    currentImage = null,
    onChange,
    maxSizeMB = 5,
    disabled = false,
    className
}) => {
    const [preview, setPreview] = useState(currentImage);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        setError('');
        
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a JPG, PNG, or WebP image');
            return false;
        }
        
        // Check file size
        const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
        if (file.size > maxSize) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }
        
        return true;
    };

    const handleFileChange = (file) => {
        if (!file) return;
        
        if (!validateFile(file)) return;
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onChange(file, reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = () => {
        setPreview(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onChange(null, null);
    };

    return (
        <div className={cn("space-y-3", className)}>
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
            
            <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={48} className="text-muted-foreground" />
                        )}
                    </div>
                </div>
                
                {/* Upload Area */}
                <div className="flex-1">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={cn(
                            "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200",
                            isDragging
                                ? "border-primary bg-primary/5"
                                : "border-border bg-muted/30",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Upload
                            size={32}
                            className={cn(
                                "mx-auto mb-3",
                                isDragging ? "text-primary" : "text-muted-foreground"
                            )}
                        />
                        <p className="text-sm font-medium text-foreground mb-2">
                            {isDragging ? "Drop image here" : "Drag and drop or click to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                            JPG, PNG or WebP (max {maxSizeMB}MB)
                        </p>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            id={id}
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleInputChange}
                            disabled={disabled}
                            className="hidden"
                            aria-label={label}
                        />
                        
                        <div className="flex gap-2 justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={disabled}
                            >
                                Choose File
                            </Button>
                            
                            {preview && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemove}
                                    disabled={disabled}
                                >
                                    <X size={16} />
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {error && (
                        <p className="text-sm text-destructive font-medium mt-2" role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
