import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Lock, Mail, Phone, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        identifier: '', // Can be email or phone
        password: '',
        rememberMe: false
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [inputType, setInputType] = useState('email'); // 'email' or 'phone'

    // Detect if input is email or phone
    const handleIdentifierChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, identifier: value });
        
        // Simple detection: if it starts with digits, assume phone
        if (value.match(/^\d/)) {
            setInputType('phone');
        } else {
            setInputType('email');
        }
        
        // Clear error on change
        if (errors.identifier) {
            setErrors({ ...errors, identifier: '' });
        }
    };

    const handlePasswordChange = (e) => {
        setFormData({ ...formData, password: e.target.value });
        if (errors.password) {
            setErrors({ ...errors, password: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.identifier.trim()) {
            newErrors.identifier = 'Email or phone number is required';
        } else if (inputType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.identifier)) {
                newErrors.identifier = 'Please enter a valid email address';
            }
        } else if (inputType === 'phone') {
            const phoneRegex = /^\d{10,}$/;
            if (!phoneRegex.test(formData.identifier.replace(/\D/g, ''))) {
                newErrors.identifier = 'Please enter a valid phone number';
            }
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(async () => {
            try {
                // Demo login - in production, this would call your API
                await login({
                    userData: {
                        id: 'user-1',
                        name: 'John Doe',
                        email: formData.identifier,
                        role: 'patient'
                    }
                });
                
                navigate('/patient');
            } catch {
                setErrors({ submit: 'Invalid credentials. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            {/* Subtle medical background pattern */}
            <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23158765' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <Card className="w-full max-w-md shadow-2xl shadow-primary/10 relative z-10 border-border/50">
                <CardContent className="p-8 sm:p-10">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                            <Heart size={32} className="text-primary" fill="currentColor" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            MediLink
                        </h1>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Secure access to your healthcare dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email or Phone Input */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="identifier" 
                                className="block text-base font-semibold text-foreground"
                            >
                                Email or Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    {inputType === 'email' ? <Mail size={20} /> : <Phone size={20} />}
                                </div>
                                <input
                                    id="identifier"
                                    type="text"
                                    value={formData.identifier}
                                    onChange={handleIdentifierChange}
                                    placeholder="Enter your email or phone"
                                    className={cn(
                                        "w-full h-14 pl-12 pr-4 rounded-xl border-2 bg-background text-foreground text-base",
                                        "placeholder:text-muted-foreground",
                                        "transition-all duration-200",
                                        "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
                                        errors.identifier 
                                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive" 
                                            : "border-input hover:border-primary/50"
                                    )}
                                    aria-label="Email or Phone Number"
                                    aria-describedby={errors.identifier ? "identifier-error" : undefined}
                                    aria-invalid={errors.identifier ? "true" : "false"}
                                />
                            </div>
                            {errors.identifier && (
                                <p id="identifier-error" className="text-sm text-destructive font-medium" role="alert">
                                    {errors.identifier}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="block text-base font-semibold text-foreground"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock size={20} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your password"
                                    className={cn(
                                        "w-full h-14 pl-12 pr-12 rounded-xl border-2 bg-background text-foreground text-base",
                                        "placeholder:text-muted-foreground",
                                        "transition-all duration-200",
                                        "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
                                        errors.password 
                                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive" 
                                            : "border-input hover:border-primary/50"
                                    )}
                                    aria-label="Password"
                                    aria-describedby={errors.password ? "password-error" : undefined}
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p id="password-error" className="text-sm text-destructive font-medium" role="alert">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="w-5 h-5 rounded-md border-2 border-input text-primary focus:ring-4 focus:ring-primary/20 cursor-pointer"
                                    aria-label="Remember me"
                                />
                                <span className="text-base text-foreground font-medium group-hover:text-primary transition-colors">
                                    Remember me
                                </span>
                            </label>
                            
                            <Link 
                                to="/forgot-password" 
                                className="text-base text-primary font-semibold hover:text-primary/80 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-md px-1"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                <p className="text-sm text-destructive font-medium" role="alert">
                                    {errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-14 text-lg font-semibold rounded-xl"
                            isLoading={isLoading}
                            aria-label="Sign in to your account"
                        >
                            {!isLoading && (
                                <>
                                    Sign In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </Button>

                        {/* Create Account Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-14 text-lg font-medium rounded-xl"
                            onClick={() => navigate('/register')}
                            aria-label="Create a new account"
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Trust Element */}
                    <div className="mt-8 pt-6 border-t border-border/50">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <ShieldCheck size={16} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground mb-1">
                                    Your data is encrypted and protected
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    We use industry-standard encryption to keep your health information secure and private.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
