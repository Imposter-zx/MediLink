import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Truck, MapPin, CheckCircle, Navigation, Box } from 'lucide-react';
import { cn } from '../lib/utils';

const DeliveryCard = ({ delivery, onAction }) => {
    const isAvailable = delivery.status === 'ready_for_pickup';
    const isInTransit = delivery.status === 'in_transit';

    return (
        <Card className={cn(
            "border-l-4 transition-all hover:shadow-md",
            isAvailable ? "border-l-primary" : "border-l-accent"
        )}>
            <CardContent className="space-y-4 p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-secondary p-1.5 rounded-md">
                                <Box size={16} className="text-secondary-foreground" />
                            </div>
                            <span className="font-mono font-bold text-foreground">#{delivery.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold uppercase tracking-wide">
                                {delivery.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/80 mb-1">
                            <MapPin size={16} className="text-primary" />
                            <span className="text-sm font-medium">{delivery.address}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">To: {delivery.recipient}</p>
                    </div>
                    {isInTransit && (
                        <div className="animate-pulse bg-accent/10 p-2 rounded-full text-accent">
                            <Navigation size={20} />
                        </div>
                    )}
                </div>

                <div className="pt-3 border-t border-border flex gap-2">
                    {isAvailable && (
                        <Button className="w-full" onClick={() => onAction(delivery.id, 'accept')}>
                            Accept Delivery
                        </Button>
                    )}
                    {isInTransit && (
                        <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => onAction(delivery.id, 'delivered')}>
                            <CheckCircle className="mr-2" size={16} />
                            Mark Delivered
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const DeliveryDashboard = () => {
    const [deliveries, setDeliveries] = useState([
        { id: 'DEL-8821', recipient: 'Mrs. Anderson', address: '12 Maple Ave, Downtown', status: 'ready_for_pickup' },
        { id: 'DEL-8822', recipient: 'Mr. Williams', address: '45 Oak St, Suburbs', status: 'in_transit' },
        { id: 'DEL-8823', recipient: 'Ilyass', address: '88 Tech Park, City', status: 'ready_for_pickup' },
    ]);

    const handleAction = (id, action) => {
        if (action === 'accept') {
            setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: 'in_transit' } : d));
        } else if (action === 'delivered') {
            setDeliveries(deliveries.filter(d => d.id !== id)); // Remove from list for demo
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <header className="flex justify-between items-center bg-card p-4 rounded-2xl shadow-sm border border-border/50">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Delivery Hub</h1>
                    <p className="text-sm text-muted-foreground">Find and manage deliveries.</p>
                </div>
                <div className="bg-background px-4 py-2 rounded-full border border-border shadow-sm flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-xs font-bold text-foreground">ONLINE</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Simulated Map Area */}
                <div className="bg-muted/30 rounded-3xl overflow-hidden relative border border-border shadow-inner flex items-center justify-center group">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                    <div className="text-center z-10 bg-background/90 backdrop-blur-md px-8 py-4 rounded-2xl shadow-lg border border-border/50 transition-transform group-hover:scale-105">
                        <MapPin size={32} className="mx-auto text-primary mb-2" />
                        <p className="font-bold text-foreground">Live Map Feed</p>
                        <p className="text-xs text-muted-foreground">Simulated GPS Tracking</p>
                    </div>
                    {/* Simulated Pins */}
                    <div className="absolute top-1/3 left-1/3 animate-bounce duration-[2000ms]">
                        <div className="w-8 h-8 bg-primary rounded-full border-4 border-background shadow-xl flex items-center justify-center text-primary-foreground">
                            <Box size={14} />
                        </div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 animate-bounce duration-[2500ms]">
                        <div className="w-8 h-8 bg-accent rounded-full border-4 border-background shadow-xl flex items-center justify-center text-accent-foreground">
                            <Navigation size={14} />
                        </div>
                    </div>
                </div>

                {/* List Area */}
                <div className="flex flex-col h-full">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4 px-2">
                        <Truck className="text-primary" size={20} />
                        Available Tasks
                    </h2>
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-hide">
                        {deliveries.map(d => (
                            <DeliveryCard key={d.id} delivery={d} onAction={handleAction} />
                        ))}
                        {deliveries.length === 0 && (
                            <div className="text-center py-20 flex flex-col items-center justify-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
                                <CheckCircle size={48} className="mb-4 text-primary/20" />
                                <p className="font-medium">All caught up!</p>
                                <p className="text-sm">No active deliveries at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
