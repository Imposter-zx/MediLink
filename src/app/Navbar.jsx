import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Home, Pill, Truck, User, Menu, X, Bookmark, Mail, Bell, Stethoscope, Search, Lock, Check, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Patient', path: '/patient', icon: User, role: 'patient' },
        { name: 'Refills', path: '/patient/refills', icon: Pill, role: 'patient' },
        { name: 'Search Meds', path: '/medications/search', icon: Search, role: 'patient' },
        { name: 'Messages', path: '/messages/patient', icon: Mail, role: 'patient' },
        { name: 'Pharmacy', path: '/pharmacy', icon: Pill, role: 'pharmacy' },
        { name: 'Approvals', path: '/pharmacy/refills', icon: Check, role: 'pharmacy' },
        { name: 'Library', path: '/library', icon: Bookmark },
        { name: 'Delivery', path: '/delivery', icon: Truck, role: 'delivery' },
        { name: 'Tracking', path: '/delivery/tracking', icon: Truck, role: 'delivery' },
        { name: 'Doctor', path: '/doctor', icon: Stethoscope, role: 'doctor' },
    ];

    const visibleNavItems = navItems.filter(item => {
        if (!item.role) return true;
        return user && user.role === item.role;
    });

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleNavClick = (item) => {
        if (item.role && user?.role !== item.role) {
            if (import.meta.env.DEV) {
                console.log('[Navbar] Role mismatch — would auto-login in dev mode');
            }
            navigate('/');
            setIsMobileMenuOpen(false);
            return;
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
                            {visibleNavItems.map((item) => {
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
                        
                        {/* Settings & Auth Actions */}
                        <div className="flex items-center gap-2">
                            {/* Notifications Bell */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => navigate('/notifications')}
                                className="rounded-full relative"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            </Button>
                            
                        {/* Settings Dropdown */}
                            <div className="relative">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className={cn("rounded-full", isSettingsOpen && "bg-muted")}
                                    aria-label="Settings menu"
                                >
                                    <Settings size={20} />
                                </Button>
                                
                                {isSettingsOpen && (
                                    <>
                                        {/* Backdrop to close dropdown */}
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsSettingsOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-2 w-64 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setIsSettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                                >
                                                    <User size={18} />
                                                    <span className="font-medium">My Profile</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/notifications');
                                                        setIsSettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                                >
                                                    <Bell size={18} />
                                                    <span className="font-medium">Notifications</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/notifications/preferences');
                                                        setIsSettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                                >
                                                    <Bell size={18} />
                                                    <span className="font-medium">Notification Settings</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/auth/two-factor');
                                                        setIsSettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                                >
                                                    <Lock size={18} />
                                                    <span className="font-medium">Two-Factor Auth</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/settings');
                                                        setIsSettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                                >
                                                    <Settings size={18} />
                                                    <span className="font-medium">Settings</span>
                                                </button>
                                            </div>
                                            <div className="border-t border-border p-2">
                                                <ThemeSwitcher />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {/* Sign In / User Button */}
                            {!user ? (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/patient')}
                                    className="rounded-full px-4"
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                                    <User size={16} />
                                    <span className="text-sm font-medium">{user.name}</span>
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
                        {visibleNavItems.map((item) => {
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
