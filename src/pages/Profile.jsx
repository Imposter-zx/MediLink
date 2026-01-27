import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Calendar,
    Droplets, Activity, Clock, Shield, 
    Settings as SettingsIcon, Edit3, Heart, 
    ShieldCheck, ClipboardList, LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-muted/30 py-8 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Card */}
                <Card className="mb-6 overflow-hidden border-none shadow-xl shadow-primary/5 bg-gradient-to-r from-primary/5 via-background to-background">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-background shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop" 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
                                    <ShieldCheck size={20} />
                                </div>
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-foreground">{user?.name || 'Ilyass'}</h1>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        {user?.role || 'Patient'}
                                    </span>
                                </div>
                                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <Calendar size={16} />
                                    Member since January 2024
                                </p>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <Button variant="primary" size="sm" className="rounded-full shadow-md">
                                        <Edit3 size={16} />
                                        Edit Profile
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-full bg-background"
                                        onClick={() => navigate('/settings')}
                                    >
                                        <SettingsIcon size={16} />
                                        Settings
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column - Personal Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Personal Info</CardTitle>
                                <User size={16} className="text-primary" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium">Username</span>
                                    <span className="text-sm font-semibold text-foreground">@ilyass_dev</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium">Email</span>
                                    <span className="text-sm font-semibold text-foreground">{user?.email || 'ilyass@medilink.com'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium">Phone</span>
                                    <span className="text-sm font-semibold text-foreground">+212 600-000000</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium">Main Address</span>
                                    <span className="text-sm font-semibold text-foreground">123 Health Ave, Casablanca</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Security</CardTitle>
                                <Shield size={16} className="text-primary" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-semibold text-foreground">2FA Active</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-green-600">Secure</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium">Last Password Change</span>
                                    <span className="text-sm font-semibold text-foreground">3 months ago</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Medical & Activity */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Medical Summary - Only for Patients */}
                        {(user?.role === 'patient' || !user) && (
                            <Card className="bg-primary/[0.02] border-primary/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Medical Summary</CardTitle>
                                    <Heart size={16} className="text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                                <Droplets size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Blood Type</p>
                                                <p className="text-lg font-black text-foreground">A+</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Height</p>
                                                <p className="text-lg font-black text-foreground">182<span className="text-xs font-medium ml-0.5">cm</span></p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Weight</p>
                                                <p className="text-lg font-black text-foreground">78<span className="text-xs font-medium ml-0.5">kg</span></p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Heart size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Pulse</p>
                                                <p className="text-lg font-black text-foreground">72<span className="text-xs font-medium ml-0.5">bpm</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                                            <h4 className="text-xs font-black uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-primary" />
                                                Known Allergies
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['Peanuts', 'Lactose'].map(tag => (
                                                    <span key={tag} className="px-2 py-1 rounded-md bg-white border border-border text-[10px] font-bold text-foreground">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                                            <h4 className="text-xs font-black uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                                <ClipboardList size={14} className="text-primary" />
                                                Active Conditions
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['Mild Hypertension'].map(tag => (
                                                    <span key={tag} className="px-2 py-1 rounded-md bg-white border border-border text-[10px] font-bold text-foreground">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</CardTitle>
                                <Clock size={16} className="text-primary" />
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/50">
                                    {[
                                        { title: 'Prescription Renewed', desc: 'Amoxicillin 500mg', time: '2 hours ago', icon: Heart, color: 'text-primary' },
                                        { title: 'New Lab Sample', desc: 'Blood analysis completed', time: '1 day ago', icon: Activity, color: 'text-blue-500' },
                                        { title: 'Profile Updated', desc: 'Secondary address added', time: '3 days ago', icon: Edit3, color: 'text-yellow-500' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                                            <div className={cn("p-2 rounded-xl bg-background border border-border shadow-sm", item.color)}>
                                                <item.icon size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                                                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 text-center border-t border-border/50">
                                    <button className="text-xs font-bold text-primary hover:underline">View All Activity</button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
