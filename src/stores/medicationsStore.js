import { create } from 'zustand';

/**
 * Medications Store - Manages the user's personal medication list
 * Allows for adding, editing, and tracking dosages.
 */
export const useMedicationsStore = create((set, get) => ({
  medications: [
    { id: 1, name: 'Aspirin', dosage: '100mg', frequency: 'Daily', time: '08:00 AM', type: 'pill', category: 'Analgesic' },
    { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'With Lunch', time: '12:00 PM', type: 'capsule', category: 'Antidiabetic' },
    { id: 3, name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', time: '08:00 PM', type: 'pill', category: 'ACE Inhibitor' },
    { id: 4, name: 'Vitamin D', dosage: '1000IU', frequency: 'Weekly', time: '09:00 AM', type: 'supplement', category: 'Supplement' },
  ],

  isLoading: false,
  error: null,

  /**
   * Add a new medication to the list
   * @param {Object} medication - The medication object to add
   */
  addMedication: (medication) => set((state) => ({
    medications: [
      ...state.medications,
      { ...medication, id: medication.id || Date.now() }
    ]
  })),

  /**
   * Update an existing medication
   * @param {number|string} id - The ID of the medication to update
   * @param {Object} updates - The fields to update
   */
  updateMedication: (id, updates) => set((state) => ({
    medications: state.medications.map(med => 
      med.id === id ? { ...med, ...updates } : med
    )
  })),

  /**
   * Remove a medication from the list
   * @param {number|string} id - The ID of the medication to remove
   */
  removeMedication: (id) => set((state) => ({
    medications: state.medications.filter(med => med.id !== id)
  })),

  /**
   * Get medication by ID
   * @param {number|string} id 
   * @returns {Object|undefined}
   */
  getMedicationById: (id) => {
    return get().medications.find(med => med.id === id);
  },

  /**
   * Search and filter medications
   * @param {string} query 
   * @returns {Array}
   */
  searchMedications: (query) => {
    const q = query.toLowerCase();
    return get().medications.filter(med => 
      med.name.toLowerCase().includes(q) || 
      med.category?.toLowerCase().includes(q)
    );
  }
}));
