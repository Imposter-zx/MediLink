import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, Pill } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { cn } from '../lib/utils';

const Medications = () => {
    const [meds, setMeds] = useState([
        { id: 1, name: 'Aspirin', dosage: '100mg', frequency: 'Daily', time: '08:00 AM', type: 'pill' },
        { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'With Lunch', time: '12:00 PM', type: 'capsule' },
        { id: 3, name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', time: '08:00 PM', type: 'pill' },
        { id: 4, name: 'Vitamin D', dosage: '1000IU', frequency: 'Weekly', time: '09:00 AM', type: 'supplement' },
    ]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Medications</h1>
                    <p className="text-muted-foreground">Manage your prescriptions and supplements.</p>
                </div>
                <Button className="shadow-lg shadow-primary/25">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Medication
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search your medications..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meds.map((med) => (
                    <Card key={med.id} className="group hover:border-primary/50 transition-colors">
                        <CardContent className="p-6 flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Pill size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{med.name}</h3>
                                    <p className="text-muted-foreground font-medium">{med.dosage}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <div className="flex items-center text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                            <Calendar size={12} className="mr-1.5" />
                                            {med.frequency}
                                        </div>
                                        <div className="flex items-center text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                            <Clock size={12} className="mr-1.5" />
                                            {med.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Edit
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Medications;
