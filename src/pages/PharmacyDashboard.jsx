import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Package, Clock, CheckCircle, Truck, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import NewRequestModal from '../components/pharmacy/NewRequestModal';
import { useOrdersStore } from '../stores/ordersStore';

const OrderCard = ({ order, onStatusChange }) => {
    const statusStyles = {
        pending: 'bg-accent/10 text-accent border-accent/20',
        ready: 'bg-primary/10 text-primary border-primary/20',
        picked_up: 'bg-muted text-muted-foreground border-border',
    };

    return (
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono font-bold text-lg text-foreground">#{order.id}</span>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border", statusStyles[order.status])}>
                            {order.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-foreground font-semibold text-lg">{order.patientName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="font-medium bg-secondary px-2 py-0.5 rounded text-secondary-foreground">{order.medication}</span>
                        <span>•</span>
                        <span>{order.dosage}</span>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    {order.status === 'pending' && (
                        <Button size="sm" className="w-full md:w-auto" onClick={() => onStatusChange(order.id, 'ready')}>
                            Mark Ready
                        </Button>
                    )}
                    {order.status === 'ready' && (
                        <Button size="sm" variant="secondary" className="w-full md:w-auto" onClick={() => onStatusChange(order.id, 'ready_for_pickup')}>
                            <Truck size={16} className="mr-2" /> Assign Delivery
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const PharmacyDashboard = () => {
    const { orders, addOrder, updateStatus, getPendingCount, getReadyCount } = useOrdersStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatusChange = (id, newStatus) => {
        updateStatus(id, newStatus);
        
        // If assigned to delivery, adding to delivery queue (simulated)
        if (newStatus === 'ready_for_pickup') {
            console.log(`[Pharmacy] Order #${id} assigned to delivery`);
        }
    };

    const handleNewRequest = (newRequest) => {
        addOrder(newRequest);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Pharmacy Portal</h1>
                    <p className="text-muted-foreground mt-1">Manage incoming prescriptions and inventory.</p>
                </div>
                <Button 
                    className="shadow-lg shadow-primary/20"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Package className="mr-2" size={18} />
                    New Request
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats */}
                <Card className="border-none shadow-md bg-accent/5">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="p-3 bg-accent/10 text-accent rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                            <p className="text-3xl font-bold text-foreground">{getPendingCount()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-primary/5">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Ready for Pickup</p>
                            <p className="text-3xl font-bold text-foreground">{getReadyCount()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">Active Orders</h2>
                    <div className="relative hidden md:block w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            className="w-full bg-secondary border-transparent rounded-lg pl-9 pr-4 py-2 text-sm focus:bg-background focus:ring-2 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
                            placeholder="Search orders..."
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            </div>

            <NewRequestModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleNewRequest}
            />
        </div>
    );
};

export default PharmacyDashboard;
