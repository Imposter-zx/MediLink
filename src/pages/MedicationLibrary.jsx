import React, { useState } from 'react';
import { Search, Filter, Bookmark, Info, Pill, Plus, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import MedicineDetailModal from '../components/library/MedicineDetailModal';
import { useMedplum } from '@medplum/react';
import { useEffect } from 'react';

import { Skeleton } from '@mantine/core';

// Mock data for fallback/demo mode
const MOCK_MEDICATIONS = [
    {
        id: 'mock-1',
        name: 'Amoxicillin 500mg',
        productType: [{ coding: [{ display: 'Antibiotic' }] }],
        indicationGuideline: [{ indication: [{ display: 'Used to treat bacterial infections.' }] }],
        drugCharacteristic: [{ valueCodeableConcept: { coding: [{ display: 'Capsule' }] } }]
    },
    {
        id: 'mock-2',
        name: 'Lisinopril 10mg',
        productType: [{ coding: [{ display: 'ACE Inhibitor' }] }],
        indicationGuideline: [{ indication: [{ display: 'Used to treat high blood pressure.' }] }],
        drugCharacteristic: [{ valueCodeableConcept: { coding: [{ display: 'Tablet' }] } }]
    },
    {
        id: 'mock-3',
        name: 'Metformin 500mg',
        productType: [{ coding: [{ display: 'Antidiabetic' }] }],
        indicationGuideline: [{ indication: [{ display: 'Used to treat type 2 diabetes.' }] }],
        drugCharacteristic: [{ valueCodeableConcept: { coding: [{ display: 'Tablet' }] } }]
    },
    {
        id: 'mock-4',
        name: 'Atorvastatin 20mg',
        productType: [{ coding: [{ display: 'Statin' }] }],
        indicationGuideline: [{ indication: [{ display: 'Used to lower cholesterol.' }] }],
        drugCharacteristic: [{ valueCodeableConcept: { coding: [{ display: 'Tablet' }] } }]
    },
    {
        id: 'mock-5',
        name: 'Albuterol Inhaler',
        productType: [{ coding: [{ display: 'Bronchodilator' }] }],
        indicationGuideline: [{ indication: [{ display: 'Used to treat asthma and COPD.' }] }],
        drugCharacteristic: [{ valueCodeableConcept: { coding: [{ display: 'Inhaler' }] } }]
    },
    {
        id: 'mock-6',
        name: 'Ibuprofen 200mg',
        productType: [{ coding: [{ display: 'NSAID' }] }],
        indicationGuideline: [{ indication: [{ display: 'Used to treat pain and inflammation.' }] }],
        drugCharacteristic: [{ valueCodeableConcept: { coding: [{ display: 'Tablet' }] } }]
    }
];

const MedicationLibrary = () => {
    const medplum = useMedplum();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch medications from Medplum FHIR server
    useEffect(() => {
        const fallbackToMock = () => {
            if (searchQuery) {
                const filtered = MOCK_MEDICATIONS.filter(med => 
                    med.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setMedicines(filtered);
            } else {
                setMedicines(MOCK_MEDICATIONS);
            }
        };

        const fetchMedications = async () => {
            setLoading(true);
            try {
                // Search for MedicationKnowledge resources
                // In FHIR, MedicationKnowledge holds the definition and clinical info
                const resources = await medplum.searchResources('MedicationKnowledge', {
                    _count: 20,
                    name: searchQuery ? `contains=${searchQuery}` : undefined
                });
                
                if (resources && resources.length > 0) {
                    setMedicines(resources);
                } else {
                    // Fallback if no resources found (or if API returns empty for demo)
                    fallbackToMock();
                }
            } catch (error) {
                console.warn("Failed to fetch medications (using mock data):", error);
                fallbackToMock();
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchMedications();
        }, 500); // 500ms debounce for search

        return () => clearTimeout(debounceTimer);
    }, [medplum, searchQuery]);

    const handleViewDetails = (medicine) => {
        setSelectedMedicine(medicine);
        setIsModalOpen(true);
    };

    /**
     * Helper to safely extract text from FHIR data types
     */
    const getDisplayValue = (resource, field) => {
        if (!resource) return 'Unknown';
        
        // Handle codeable concepts (common in FHIR)
        if (field === 'category' && resource.code?.coding?.[0]?.display) {
            return resource.code.coding[0].display;
        }
        
        // Handle name if it's not a direct string
        if (field === 'name') {
            return resource.name || resource.code?.coding?.[0]?.display || 'Unnamed Medication';
        }

        return 'N/A';
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
                        {medicines.length} + Items
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search for medication names..."
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
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex justify-between">
                                <Skeleton height={56} width={56} radius="xl" />
                                <Skeleton height={24} width={80} radius="xl" />
                            </div>
                            <Skeleton height={32} width="70%" radius="md" />
                            <div className="space-y-2">
                                <Skeleton height={16} width="100%" radius="md" />
                                <Skeleton height={16} width="90%" radius="md" />
                                <Skeleton height={16} width="80%" radius="md" />
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <Skeleton height={20} width={100} radius="md" />
                                <Skeleton height={40} width={120} radius="xl" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : medicines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {medicines.map((med) => (
                        <Card key={med.id} className="group overflow-hidden border-2 border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-[2.5rem]">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Bookmark size={28} />
                                    </div>
                                    <div className="px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs font-black uppercase rounded-full">
                                        {/* FHIR Category mapping */}
                                        {med.productType?.[0]?.coding?.[0]?.display || 'Medication'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground">
                                        {getDisplayValue(med, 'name')}
                                    </h3>
                                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                        {/* Fallback description from FHIR Indication or basic text */}
                                        {med.indicationGuideline?.[0]?.indication?.[0]?.display || 'No description available for this medication.'}
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-primary">
                                        {/* FHIR Dosage Form */}
                                        {med.drugCharacteristic?.[0]?.valueCodeableConcept?.coding?.[0]?.display || 'Standard Dose'}
                                    </span>
                                    <Button 
                                        onClick={() => handleViewDetails(med)}
                                        variant="outline" 
                                        className="rounded-full font-bold transition-all"
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
                        <p className="text-muted-foreground">Try searching with a different keyword.</p>
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
