import React, { useState } from 'react';
import { Search, Filter, Bookmark, Info, Pill, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import MedicineDetailModal from '../components/library/MedicineDetailModal';

const MOCK_MEDICINES = [
    {
        id: 1,
        name: 'Paracetamol',
        category: 'Analgesic & Antipyretic',
        description: 'Used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
        dosage: '500mg to 1000mg',
        administration: 'Take every 4-6 hours as needed, do not exceed 4000mg per day.',
        sideEffects: ['Nausea', 'Upper stomach pain', 'Loss of appetite', 'Dark urine', 'Jaundice'],
        warnings: 'Avoid using if you have severe liver disease. Overdose can cause serious liver damage.'
    },
    {
        id: 2,
        name: 'Amoxicillin',
        category: 'Antibiotic',
        description: 'A penicillin antibiotic that fights bacteria. Used to treat many different types of infection caused by bacteria.',
        dosage: '250mg or 500mg',
        administration: 'Take every 8-12 hours, usually with food to prevent stomach upset.',
        sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Rash', 'Yeast infection'],
        warnings: 'Do not use if allergic to penicillin. Complete the full course even if symptoms disappear.'
    },
    {
        id: 3,
        name: 'Metformin',
        category: 'Antidiabetic',
        description: 'Used with diet and exercise to improve blood sugar control in adults with type 2 diabetes mellitus.',
        dosage: '500mg, 850mg, or 1000mg',
        administration: 'Take with meals to reduce gastrointestinal side effects.',
        sideEffects: ['Diarrhea', 'Bloating', 'Stomach pain', 'Metallic taste', 'B12 deficiency'],
        warnings: 'Risk of lactic acidosis. Tell your doctor if you have kidney disease before taking.'
    },
    {
        id: 4,
        name: 'Lisinopril',
        category: 'ACE Inhibitor',
        description: 'Used to treat high blood pressure (hypertension) or heart failure. It is also used to improve survival after a heart attack.',
        dosage: '5mg, 10mg, or 20mg',
        administration: 'Take once daily at the same time each day.',
        sideEffects: ['Dry cough', 'Dizziness', 'Headache', 'Low blood pressure', 'Fatigue'],
        warnings: 'Do not use during pregnancy. It can cause serious injury or death to an unborn baby.'
    },
    {
        id: 5,
        name: 'Atorvastatin',
        category: 'Statin',
        description: 'Used to lower cholesterol and triglycerides (types of fat) in the blood.',
        dosage: '10mg, 20mg, 40mg, or 80mg',
        administration: 'Take once daily, usually in the evening.',
        sideEffects: ['Joint pain', 'Nasal congestion', 'Sore throat', 'Muscle weakness', 'UTI'],
        warnings: 'Can cause muscle breakdown. Consult doctor if you have unexplained muscle pain.'
    },
    {
        id: 6,
        name: 'Ibuprofen',
        category: 'NSAID',
        description: 'Used to reduce fever and treat pain or inflammation caused by many conditions.',
        dosage: '200mg to 800mg',
        administration: 'Take with food or milk to prevent stomach upset.',
        sideEffects: ['Heartburn', 'Constipation', 'Gas', 'Dizziness', 'Tinnitus'],
        warnings: 'Can increase risk of fatal heart attack or stroke. Avoid long-term use.'
    }
];

const MedicationLibrary = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredMedicines = MOCK_MEDICINES.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewDetails = (medicine) => {
        setSelectedMedicine(medicine);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Medicine Library</h1>
                    <p className="text-muted-foreground text-lg">Explore trusted healthcare information for your peace of mind.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-2xl text-secondary-foreground font-bold flex items-center gap-2">
                        <Pill size={20} />
                        {MOCK_MEDICINES.length} Items
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search for medication names, categories, or symptoms..."
                        className="w-full pl-12 pr-4 py-5 rounded-[2rem] border-2 border-border bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-lg shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-16 px-8 rounded-[2rem] border-2 flex gap-2 font-bold">
                    <Filter size={20} />
                    Filters
                </Button>
            </div>

            {/* Content Grid */}
            {filteredMedicines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMedicines.map((med) => (
                        <Card key={med.id} className="group overflow-hidden border-2 border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-[2.5rem]">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Bookmark size={28} />
                                    </div>
                                    <div className="px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs font-black uppercase rounded-full">
                                        {med.category}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground">{med.name}</h3>
                                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                        {med.description}
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-primary">{med.dosage}</span>
                                    <Button 
                                        onClick={() => handleViewDetails(med)}
                                        variant="outline" 
                                        className="rounded-full font-bold group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                                    >
                                        View Details
                                        <Plus size={16} className="ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                        <Search size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">No medicines found</h2>
                        <p className="text-muted-foreground">Try searching with a different keyword or category.</p>
                    </div>
                    <Button variant="ghost" className="font-bold text-primary" onClick={() => setSearchQuery('')}>
                        Clear Search
                    </Button>
                </div>
            )}

            <MedicineDetailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                medicine={selectedMedicine} 
            />
        </div>
    );
};

export default MedicationLibrary;
