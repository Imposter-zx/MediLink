import { Injectable } from '@nestjs/common';

/**
 * Medication search filters
 */
export interface MedicationFilters {
  name?: string;
  condition?: string;
  indication?: string;
  sideEffects?: string[];
  drugClass?: string;
  manufacturer?: string;
  minRating?: number;
  maxPrice?: number;
  inStock?: boolean;
  prescriptionRequired?: boolean;
  genericAvailable?: boolean;
}

/**
 * Medication with extended information
 */
export interface ExtendedMedication {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  drugClass: string;
  indication: string; // What it's used for
  dosageForm: string; // Tablet, Capsule, etc
  strength: string;
  sideEffects: string[];
  contraindications: string[];
  drugInteractions: string[];
  price: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  prescriptionRequired: boolean;
  genericAvailable: boolean;
  alternativeMedications: string[];
  warnings: string[];
}

/**
 * Advanced Medication Search Service
 * Provides comprehensive medication search with filtering and recommendations
 */
@Injectable()
export class MedicationSearchService {
  // Mock medication database
  private medications: ExtendedMedication[] = [
    {
      id: 'med-001',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      manufacturer: 'Merck',
      drugClass: 'ACE Inhibitor',
      indication: 'Hypertension, Heart Failure',
      dosageForm: 'Tablet',
      strength: '10mg',
      sideEffects: ['Dry cough', 'Dizziness', 'Fatigue'],
      contraindications: ['Pregnancy', 'Angioedema history'],
      drugInteractions: ['NSAIDs', 'Potassium supplements', 'Diuretics'],
      price: 15.99,
      inStock: true,
      rating: 4.5,
      reviews: 342,
      prescriptionRequired: true,
      genericAvailable: true,
      alternativeMedications: ['Enalapril', 'Ramipril'],
      warnings: ['Monitor renal function', 'Can cause hyperkalemia'],
    },
    {
      id: 'med-002',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      manufacturer: 'Bayer',
      drugClass: 'NSAID',
      indication: 'Pain, Fever, Cardiovascular Protection',
      dosageForm: 'Tablet',
      strength: '325mg',
      sideEffects: ['Stomach upset', 'Heartburn', 'Easy bruising'],
      contraindications: ['Peptic ulcer disease', 'Bleeding disorders'],
      drugInteractions: ['Warfarin', 'Methotrexate', 'SSRIs'],
      price: 5.99,
      inStock: true,
      rating: 4.7,
      reviews: 892,
      prescriptionRequired: false,
      genericAvailable: true,
      alternativeMedications: ['Ibuprofen', 'Naproxen'],
      warnings: ['Not for children with fever', 'Reye syndrome risk'],
    },
    {
      id: 'med-003',
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      manufacturer: 'Mylan',
      drugClass: 'Biguanide',
      indication: 'Type 2 Diabetes',
      dosageForm: 'Tablet',
      strength: '500mg',
      sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
      contraindications: ['Renal impairment', 'Metabolic acidosis'],
      drugInteractions: ['Contrast dye', 'Alcohol (excessive)'],
      price: 12.5,
      inStock: true,
      rating: 4.6,
      reviews: 567,
      prescriptionRequired: true,
      genericAvailable: true,
      alternativeMedications: ['Glipizide', 'Pioglitazone'],
      warnings: ['Monitor liver function', 'Vitamin B12 monitoring'],
    },
  ];

  /**
   * Search medications by name (full-text search)
   */
  async searchByName(query: string): Promise<ExtendedMedication[]> {
    const lowerQuery = query.toLowerCase();

    return this.medications.filter(
      med =>
        med.name.toLowerCase().includes(lowerQuery) ||
        med.genericName.toLowerCase().includes(lowerQuery) ||
        med.manufacturer.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Search medications with advanced filters
   */
  async searchWithFilters(filters: MedicationFilters): Promise<ExtendedMedication[]> {
    let results = [...this.medications];

    // Filter by name
    if (filters.name) {
      results = results.filter(
        m => m.name.toLowerCase().includes(filters.name!.toLowerCase()) || m.genericName.toLowerCase().includes(filters.name!.toLowerCase()),
      );
    }

    // Filter by condition/indication
    if (filters.condition) {
      results = results.filter(m =>
        m.indication.toLowerCase().includes(filters.condition!.toLowerCase()) ||
        m.indication.toLowerCase().includes(filters.indication!),
      );
    }

    // Filter by drug class
    if (filters.drugClass) {
      results = results.filter(m => m.drugClass.toLowerCase() === filters.drugClass!.toLowerCase());
    }

    // Filter by side effects
    if (filters.sideEffects && filters.sideEffects.length > 0) {
      results = results.filter(m => {
        const hasSideEffect = filters.sideEffects!.some(effect =>
          m.sideEffects.some(s => s.toLowerCase().includes(effect.toLowerCase())),
        );
        return !hasSideEffect; // Exclude medications with these side effects
      });
    }

    // Filter by price
    if (filters.maxPrice) {
      results = results.filter(m => m.price <= filters.maxPrice!);
    }

    // Filter by stock
    if (filters.inStock) {
      results = results.filter(m => m.inStock === true);
    }

    // Filter by prescription requirement
    if (filters.prescriptionRequired !== undefined) {
      results = results.filter(m => m.prescriptionRequired === filters.prescriptionRequired);
    }

    // Filter by generic availability
    if (filters.genericAvailable !== undefined) {
      results = results.filter(m => m.genericAvailable === filters.genericAvailable);
    }

    // Filter by rating
    if (filters.minRating) {
      results = results.filter(m => m.rating >= filters.minRating!);
    }

    return results;
  }

  /**
   * Get medication by ID
   */
  async getMedicationById(id: string): Promise<ExtendedMedication | null> {
    return this.medications.find(m => m.id === id) || null;
  }

  /**
   * Get all medications for a condition
   */
  async getMedicationsForCondition(condition: string): Promise<ExtendedMedication[]> {
    const lowerCondition = condition.toLowerCase();
    return this.medications.filter(m => m.indication.toLowerCase().includes(lowerCondition));
  }

  /**
   * Check for drug interactions
   */
  async checkDrugInteractions(medicationIds: string[]): Promise<{
    safe: boolean;
    interactions: Array<{ medication1: string; medication2: string; interaction: string }>;
  }> {
    const medications = medicationIds.map(id => this.medications.find(m => m.id === id)).filter(Boolean) as ExtendedMedication[];

    const interactions: Array<{ medication1: string; medication2: string; interaction: string }> = [];

    // Check for common interactions
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];

        // Check if med2 is in med1's interactions
        if (med1.drugInteractions.some(d => med2.name.includes(d) || med2.genericName.includes(d))) {
          interactions.push({
            medication1: med1.name,
            medication2: med2.name,
            interaction: `${med1.name} may interact with ${med2.name}`,
          });
        }
      }
    }

    return {
      safe: interactions.length === 0,
      interactions,
    };
  }

  /**
   * Get alternative medications
   */
  async getAlternatives(medicationId: string): Promise<ExtendedMedication[]> {
    const medication = await this.getMedicationById(medicationId);
    if (!medication) return [];

    return this.medications.filter(
      m => medication.alternativeMedications.includes(m.name) || medication.alternativeMedications.includes(m.genericName),
    );
  }

  /**
   * Get medications by drug class
   */
  async getMedicationsByClass(drugClass: string): Promise<ExtendedMedication[]> {
    return this.medications.filter(m => m.drugClass.toLowerCase() === drugClass.toLowerCase());
  }

  /**
   * Get generic alternatives
   */
  async getGenericAlternatives(medicationId: string): Promise<ExtendedMedication[]> {
    const medication = await this.getMedicationById(medicationId);
    if (!medication || !medication.genericAvailable) return [];

    return this.medications.filter(m => m.genericName === medication.genericName && m.id !== medicationId);
  }

  /**
   * Get top-rated medications for a condition
   */
  async getTopRatedForCondition(condition: string, limit: number = 5): Promise<ExtendedMedication[]> {
    const medications = await this.getMedicationsForCondition(condition);
    return medications.sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  /**
   * Get affordable alternatives
   */
  async getAffordableAlternatives(medicationId: string, maxPrice: number): Promise<ExtendedMedication[]> {
    const medication = await this.getMedicationById(medicationId);
    if (!medication) return [];

    return this.medications.filter(
      m =>
        m.indication === medication.indication &&
        m.price <= maxPrice &&
        m.rating >= medication.rating - 0.5 &&
        m.id !== medicationId,
    );
  }

  /**
   * Get medication recommendations based on symptoms
   */
  async recommendMedicationsForSymptoms(symptoms: string[]): Promise<ExtendedMedication[]> {
    // Simple recommendation engine - would be more sophisticated in production
    const lowerSymptoms = symptoms.map(s => s.toLowerCase());

    return this.medications.filter(m =>
      lowerSymptoms.some(
        symptom =>
          m.indication.toLowerCase().includes(symptom) ||
          m.drugClass.toLowerCase().includes(symptom),
      ),
    );
  }

  /**
   * Get medication warnings
   */
  async getMedicationWarnings(medicationId: string): Promise<string[]> {
    const medication = await this.getMedicationById(medicationId);
    return medication?.warnings || [];
  }

  /**
   * Get cost comparison for a condition
   */
  async compareCosts(condition: string): Promise<
    Array<{
      name: string;
      price: number;
      genericAvailable: boolean;
      rating: number;
    }>
  > {
    const medications = await this.getMedicationsForCondition(condition);

    return medications
      .map(m => ({
        name: m.name,
        price: m.price,
        genericAvailable: m.genericAvailable,
        rating: m.rating,
      }))
      .sort((a, b) => a.price - b.price);
  }
}
