import React from 'react';
import MedicationList from '../components/patient/MedicationList';
import AppointmentList from '../components/patient/AppointmentList';
import MediPal from '../components/patient/MediPal';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ShoppingBag, Bell, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

import { useMedplum } from '@medplum/react';

const PatientDashboard = () => {
    const { user } = useAuthStore();
    const medplum = useMedplum();

    const handleOrder = async (medicationName) => {
        try {
            const medicationRequest = await medplum.createResource({
                resourceType: 'MedicationRequest',
                status: 'active',
                intent: 'order',
                medicationCodeableConcept: {
                    text: medicationName,
                    coding: [{ display: medicationName }]
                },
                subject: {
                    reference: `Patient/${user?.id || 'unknown'}`,
                    display: user?.name
                },
                authoredOn: new Date().toISOString()
            });
            console.log('Created MedicationRequest:', medicationRequest);
            alert(`Order placed for ${medicationName}! (FHIR ID: ${medicationRequest.id})`);
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to place order. See console for details.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Good Morning, {user?.name || 'Guest'}</h1>
                    <p className="text-muted-foreground mt-1">Here's your health overview for today.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Bell size={20} />
                    </Button>
                    <Link to="/library">
                        <Button className="rounded-full shadow-lg shadow-primary/25">
                            Order Medication
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Schedule & Meds */}
                <div className="lg:col-span-2 space-y-8">
                    <MedicationList />
                    <AppointmentList />
                </div>

                {/* Right Column: Assistant & Actions */}
                <div className="space-y-8">
                    <MediPal />

                    <QuickRefillCard onOrder={handleOrder} />

                    <Card className="bg-destructive text-destructive-foreground border-none shadow-lg shadow-destructive/20">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    SOS Emergency
                                </h3>
                                <p className="text-destructive-foreground/80 text-sm mt-1">Press if you need help</p>
                            </div>
                            <Button variant="secondary" className="bg-background text-destructive hover:bg-background/90 font-bold px-6">
                                CALL 112
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const QuickRefillCard = ({ onOrder }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
                <ShoppingBag size={20} />
                Quick Refill
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <RefillItem name="Metformin" daysLeft={5} onOrder={onOrder} />
            <RefillItem name="Lisinopril" daysLeft={3} onOrder={onOrder} />
        </CardContent>
    </Card>
);

const RefillItem = ({ name, daysLeft, onOrder }) => (
    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/50">
        <div>
            <p className="font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">Remaining: {daysLeft} days</p>
        </div>
        <Button size="sm" variant="outline" className="h-8" onClick={() => onOrder(name)}>
            Order
        </Button>
    </div>
);

export default PatientDashboard;
