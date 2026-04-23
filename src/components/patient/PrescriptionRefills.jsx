import React, { useState, useEffect } from 'react';

/**
 * Prescription Refills Component
 * Manages prescription refill requests and workflow
 */
function PrescriptionRefills() {
  const [activeTab, setActiveTab] = useState('available');
  const [prescriptions, setPrescriptions] = useState([]);
  const [refills, setRefills] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);

  // Load prescriptions on mount
  useEffect(() => {
    loadPrescriptions();
  }, []);

  /**
   * Load available prescriptions for refill
   */
  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prescriptions?status=active');
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request prescription refill
   */
  const handleRequestRefill = async (prescriptionId) => {
    setLoading(true);
    try {
      const response = await fetch('/api/prescriptions/refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescriptionId }),
      });

      if (response.ok) {
        const refill = await response.json();
        setRefills([...refills, refill]);
        alert('Refill request submitted! Your pharmacy will review it shortly.');
        setShowRefillModal(false);
        loadPrescriptions();
      }
    } catch (error) {
      console.error('Failed to request refill:', error);
      alert('Failed to submit refill request');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if prescription is eligible for refill
   */
  const isEligibleForRefill = (daysSupply, lastFilled) => {
    const daysSinceFill = Math.floor((Date.now() - new Date(lastFilled).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceFill >= daysSupply - 7; // Can refill 7 days early
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Prescription Refills</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'available'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Available to Refill
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'pending'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Refills
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Refill History
        </button>
      </div>

      {/* Available Refills */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {prescriptions.filter(p => isEligibleForRefill(p.daysSupply, p.lastFilled)).map(prescription => (
            <div key={prescription.id} className="bg-white border rounded-lg p-4 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{prescription.medicationName}</h3>
                  <p className="text-gray-600">{prescription.strength} - {prescription.dosage}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Prescribed by: Dr. {prescription.doctorName}
                  </p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>📦 Refills remaining: {prescription.refillsRemaining}</span>
                    <span>💊 Days supply: {prescription.daysSupply}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPrescription(prescription.id);
                    setShowRefillModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Request Refill
                </button>
              </div>
            </div>
          ))}

          {prescriptions.filter(p => isEligibleForRefill(p.daysSupply, p.lastFilled)).length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
              <p className="text-gray-600">No prescriptions available for refill yet.</p>
              <p className="text-sm text-gray-500 mt-2">You can request a refill when you have about 7 days of medication left.</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Refills */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {refills.filter(r => r.status === 'PENDING').map(refill => (
            <div key={refill.id} className="bg-white border border-amber-200 rounded-lg p-4 shadow bg-amber-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{refill.medicationName}</h3>
                  <p className="text-gray-600">Status: <span className="font-semibold text-amber-600">Pending Approval</span></p>
                  <p className="text-sm text-gray-500 mt-2">
                    Requested: {new Date(refill.requestDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Pharmacy: {refill.pharmacyName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl">⏳</div>
                  <p className="text-sm text-gray-500 mt-2">Under review</p>
                </div>
              </div>
            </div>
          ))}

          {refills.filter(r => r.status === 'PENDING').length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
              <p className="text-gray-600">No pending refill requests.</p>
            </div>
          )}
        </div>
      )}

      {/* Refill History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {refills.filter(r => r.status !== 'PENDING').map(refill => (
            <div key={refill.id} className="bg-white border rounded-lg p-4 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{refill.medicationName}</h3>
                  <p className="text-gray-600">
                    Status:{' '}
                    <span className={refill.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}>
                      {refill.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Date: {new Date(refill.approvalDate).toLocaleDateString()}
                  </p>
                  {refill.approverNote && (
                    <p className="text-sm mt-2 bg-gray-50 p-2 rounded">
                      Note: {refill.approverNote}
                    </p>
                  )}
                </div>
                <div>
                  {refill.status === 'APPROVED' && <div className="text-3xl">✅</div>}
                  {refill.status === 'REJECTED' && <div className="text-3xl">❌</div>}
                </div>
              </div>
            </div>
          ))}

          {refills.filter(r => r.status !== 'PENDING').length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
              <p className="text-gray-600">No refill history yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Refill Modal */}
      {showRefillModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Refill Request</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to request a refill for this prescription?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefillModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestRefill(selectedPrescription)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Confirm Refill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrescriptionRefills;
