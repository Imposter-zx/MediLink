import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { useMedicationsStore } from '../../stores/medicationsStore';

import { Skeleton } from '@mantine/core';

const MedicationList = () => {
    const { medications: meds, isLoading } = useMedicationsStore();
    const [localMeds, setLocalMeds] = useState(meds); // Still use local for the 'taken' checkbox if not in store
    
    // Sync with global store if needed
    useEffect(() => {
        setLocalMeds(meds);
    }, [meds]);

    const toggleTaken = (id) => {
        setLocalMeds(localMeds.map(med =>
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
                    {localMeds.filter(m => m.taken).length}/{localMeds.length} Taken
                </span>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-4">
                                <Skeleton height={32} width={32} radius="xl" />
                                <div>
                                    <Skeleton height={20} width={150} mb={8} radius="md" />
                                    <Skeleton height={14} width={100} radius="md" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    localMeds.map((med) => (
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
                    ))
                )}

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
