import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

const MedicationList = () => {
    const [meds, setMeds] = useState([
        { id: 1, name: 'Aspirin', dosage: '100mg', time: '08:00 AM', taken: true, type: 'pill' },
        { id: 2, name: 'Metformin', dosage: '500mg', time: '12:00 PM', taken: false, type: 'capsule' },
        { id: 3, name: 'Lisinopril', dosage: '10mg', time: '08:00 PM', taken: false, type: 'pill' },
    ]);

    const toggleTaken = (id) => {
        setMeds(meds.map(med =>
            med.id === id ? { ...med, taken: !med.taken } : med
        ));
    };

    return (
        <Card className="h-full border-none shadow-lg shadow-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Clock size={20} />
                    Today's Schedule
                </CardTitle>
                <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {meds.filter(m => m.taken).length}/{meds.length} Taken
                </span>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {meds.map((med) => (
                    <div
                        key={med.id}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group",
                            med.taken
                                ? "bg-secondary/50 border-transparent opacity-60"
                                : "bg-card border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                onClick={() => toggleTaken(med.id)}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all border-2",
                                    med.taken
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-muted-foreground/30 hover:border-primary text-transparent group-hover:text-primary/20"
                                )}
                            >
                                <Check size={16} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className={cn("font-medium text-lg leading-none mb-1", med.taken && "line-through text-muted-foreground")}>
                                    {med.name}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{med.dosage}</span>
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                                    <span>{med.time}</span>
                                </div>
                            </div>
                        </div>

                        {!med.taken && (
                            <div className="text-accent bg-accent/10 p-2 rounded-full animate-pulse">
                                <AlertCircle size={20} />
                            </div>
                        )}
                    </div>
                ))}

                <div className="pt-2">
                    <Link to="/medications">
                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                            View Full Calendar
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default MedicationList;
