import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Home, Pill, Truck, User, Menu, X, Bookmark } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import { Settings } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Patient', path: '/patient', icon: User, role: 'patient' },
        { name: 'Pharmacy', path: '/pharmacy', icon: Pill, role: 'pharmacy' },
        { name: 'Library', path: '/library', icon: Bookmark },
        { name: 'Delivery', path: '/delivery', icon: Truck, role: 'delivery' },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleNavClick = async (item) => {
        if (item.role && user?.role !== item.role) {
            // Demo auto-login for seamless navigation
            await login({ 
                userData: { 
                    id: `demo-${item.role}`, 
                    name: `${item.name} User`, 
                    role: item.role 
                } 
            });
        }
        navigate(item.path);
        setIsMobileMenuOpen(false);
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:bg-primary/90 transition-colors">
                            <Heart size={24} fill="currentColor" className="animate-pulse" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            MediLink
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavClick(item)}
                                        className={cn(
                                            "px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 text-sm font-medium",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <Icon size={18} />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Accessibility Settings */}
                        <div className="relative">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={cn("rounded-full", isSettingsOpen && "bg-muted")}
                            >
                                <Settings size={20} />
                            </Button>
                            
                            {isSettingsOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 z-50">
                                    <ThemeSwitcher />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={toggleMenu}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavClick(item)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
