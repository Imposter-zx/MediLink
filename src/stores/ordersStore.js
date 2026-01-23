import { create } from 'zustand';

// Orders Store for production-grade state sharing
export const useOrdersStore = create((set, get) => ({
  orders: [
    { id: '1024', patientName: 'Ilyass (Patient)', medication: 'Metformin', dosage: '500mg', status: 'pending' },
    { id: '1025', patientName: 'Sarah Connor', medication: 'Amoxicillin', dosage: '250mg', status: 'ready' },
    { id: '1026', patientName: 'John Doe', medication: 'Lisinopril', dosage: '10mg', status: 'pending' },
  ],

  deliveries: [
    { id: 'DEL-8821', recipient: 'Mrs. Anderson', address: '12 Maple Ave, Downtown', status: 'ready_for_pickup' },
    { id: 'DEL-8822', recipient: 'Mr. Williams', address: '45 Oak St, Suburbs', status: 'in_transit' },
    { id: 'DEL-8823', recipient: 'Ilyass', address: '88 Tech Park, City', status: 'ready_for_pickup' },
  ],

  addOrder: (newOrder) => set((state) => ({ 
    orders: [newOrder, ...state.orders] 
  })),

  updateStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),

  updateDeliveryStatus: (id, status) => set((state) => ({
    deliveries: state.deliveries.map(d => d.id === id ? { ...d, status } : d)
  })),

  removeDelivery: (id) => set((state) => ({
    deliveries: state.deliveries.filter(d => d.id !== id)
  })),

  // Selectors
  getPendingCount: () => get().orders.filter(o => o.status === 'pending').length,
  getReadyCount: () => get().orders.filter(o => o.status === 'ready').length,
  getAvailableDeliveriesCount: () => get().deliveries.filter(d => d.status === 'ready_for_pickup').length,
}));

