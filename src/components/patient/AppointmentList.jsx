import React from 'react';
import { Calendar, MapPin, Phone } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

const AppointmentList = () => {
    const appointments = [
        { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'Cardiologist', date: 'Tomorrow, 10:00 AM', location: 'Heart Center, Suite 404' },
        { id: 2, doctor: 'Dr. James Wilson', specialty: 'General Practitioner', date: 'Dec 30, 02:00 PM', location: 'City Clinic' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-primary" />
                    Upcoming Appointments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 bg-muted/30 rounded-xl space-y-3 border border-border/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-foreground">{apt.doctor}</h4>
                                <p className="text-primary text-sm font-medium">{apt.specialty}</p>
                            </div>
                            <div className="bg-background px-3 py-1 rounded-lg border border-border text-sm font-semibold text-foreground/80 shadow-sm">
                                {apt.date.split(',')[0]}
                            </div>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {apt.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                {apt.location}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="secondary" className="flex-1">Reschedule</Button>
                            <Button size="sm" variant="primary" className="flex-1">Details</Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default AppointmentList;
