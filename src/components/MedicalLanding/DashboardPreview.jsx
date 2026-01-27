import React from 'react';
import { Calendar, Pill, Truck, Activity, Bell } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';

const DashboardPreview = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10 perspective-[2000px] select-none pointer-events-none">
        {/* Blurred Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 filter blur-[1px] transform rotateX-[10deg] rotateY-[-5deg] rotateZ-[2deg] transition-all">
            
            {/* Prescription Widget */}
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-card/80 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <Pill size={18} />
                    </div>
                    <div className="h-4 w-24 bg-muted rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-muted/60 rounded-full" />
                    <div className="h-3 w-4/5 bg-muted/60 rounded-full" />
                </div>
                <div className="pt-2 flex justify-between items-center">
                    <div className="h-6 w-16 bg-muted rounded-full" />
                    <div className="h-8 w-8 bg-primary/20 rounded-full" />
                </div>
            </Card>

            {/* Appointment Widget */}
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-card p-6 space-y-4 transform translate-y-[-20px] scale-105 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <Calendar size={18} />
                    </div>
                    <div className="h-4 w-32 bg-muted rounded-full" />
                </div>
                <div className="flex items-center gap-4 py-2 border-y border-border/50">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="space-y-1">
                        <div className="h-3 w-20 bg-muted rounded-full" />
                        <div className="h-2 w-16 bg-muted/50 rounded-full" />
                    </div>
                </div>
                <div className="pt-2 h-10 w-full bg-primary/10 rounded-xl" />
            </Card>

            {/* Delivery Status Widget */}
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-card/80 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-accent/10 text-accent rounded-xl">
                        <Truck size={18} />
                    </div>
                    <div className="h-4 w-28 bg-muted rounded-full" />
                </div>
                <div className="relative h-1 w-full bg-muted rounded-full mt-4">
                    <div className="absolute top-0 left-0 h-1 w-2/3 bg-primary rounded-full" />
                </div>
                <div className="flex justify-between">
                    <div className="h-2 w-12 bg-muted rounded-full" />
                    <div className="h-2 w-12 bg-muted rounded-full" />
                </div>
                <div className="pt-2 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted" />
                    <div className="h-3 w-20 bg-muted rounded-full" />
                </div>
            </Card>
        </div>

        {/* Floating Accent Icons */}
        <div className="absolute top-[-30px] left-[-20px] p-3 bg-card rounded-2xl shadow-xl border border-border animate-bounce duration-3000">
            <Activity className="text-accent" size={24} />
        </div>
        <div className="absolute bottom-[20px] right-[-10px] p-3 bg-card rounded-2xl shadow-xl border border-border animate-pulse">
            <Bell className="text-primary" size={24} />
        </div>
    </div>
  );
};

export default DashboardPreview;
