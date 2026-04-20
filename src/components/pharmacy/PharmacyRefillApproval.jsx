import React, { useState, useEffect } from 'react';

/**
 * Pharmacy Refill Approval Component
 * Pharmacists can approve/deny prescription refill requests
 */
function PharmacyRefillApproval() {
  const [refills, setRefills] = useState([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRefill, setSelectedRefill] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  // Load refills on mount
  useEffect(() => {
    loadRefills();
    // Refresh every 30 seconds
    const interval = setInterval(loadRefills, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Load refill requests
   */
  const loadRefills = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prescriptions/refills');
      const data = await response.json();
      setRefills(data);

      // Calculate stats
      const stats = {
        pending: data.filter((r: any) => r.status === 'PENDING').length,
        approved: data.filter((r: any) => r.status === 'APPROVED').length,
        rejected: data.filter((r: any) => r.status === 'REJECTED').length,
        total: data.length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to load refills:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter refills by status
   */
  const getFilteredRefills = () => {
    return refills.filter(r => r.status === activeTab.toUpperCase());
  };

  /**
   * Approve refill
   */
  const handleApproveRefill = async (refillId: string) => {
    if (!approvalNote.trim()) {
      alert('Please enter an approval note');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/prescriptions/refills/${refillId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverNote: approvalNote }),
      });

      if (response.ok) {
        alert('✅ Refill approved successfully');
        setApprovalNote('');
        setSelectedRefill(null);
        loadRefills();
      }
    } catch (error) {
      console.error('Failed to approve refill:', error);
      alert('Failed to approve refill');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reject refill
   */
  const handleRejectRefill = async (refillId: string) => {
    if (!approvalNote.trim()) {
      alert('Please enter a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/prescriptions/refills/${refillId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverNote: approvalNote }),
      });

      if (response.ok) {
        alert('⚠️ Refill rejected successfully');
        setApprovalNote('');
        setSelectedRefill(null);
        loadRefills();
      }
    } catch (error) {
      console.error('Failed to reject refill:', error);
      alert('Failed to reject refill');
    } finally {
      setLoading(false);
    }
  };

  const filtered = getFilteredRefills();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Prescription Refill Management</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Total Refills</div>
          <div className="text-3xl font-bold text-gray-600 mt-2">{stats.total}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow border-l-4 border-l-yellow-500">
          <div className="text-sm text-gray-600">Pending Approval</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow border-l-4 border-l-green-500">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow border-l-4 border-l-red-500">
          <div className="text-sm text-gray-600">Rejected</div>
          <div className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'pending'
              ? 'border-b-2 border-yellow-500 text-yellow-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'approved'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Approved ({stats.approved})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'rejected'
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Refills List and Details */}
      <div className="grid grid-cols-3 gap-6">
        {/* List */}
        <div className="col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">
                {activeTab === 'pending' ? 'No pending refill requests' : `No ${activeTab} refills`}
              </p>
            </div>
          ) : (
            filtered.map(refill => (
              <div
                key={refill.id}
                onClick={() => setSelectedRefill(refill.id)}
                className={`bg-white border rounded-lg p-4 cursor-pointer transition shadow-sm hover:shadow-md ${
                  selectedRefill === refill.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{refill.medicationName}</h3>
                      {activeTab === 'pending' && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">⏳ Pending</span>}
                      {activeTab === 'approved' && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">✅ Approved</span>}
                      {activeTab === 'rejected' && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">❌ Rejected</span>}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Patient</p>
                        <p className="font-semibold">{refill.patientName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Requested</p>
                        <p className="font-semibold">{new Date(refill.requestDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Refills Remaining</p>
                        <p className="font-semibold">{refill.refillsRemaining}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Panel */}
        <div className="col-span-1">
          {selectedRefill ? (
            (() => {
              const refill = refills.find(r => r.id === selectedRefill);
              return refill ? (
                <div className="bg-white border rounded-lg p-6 shadow sticky top-6">
                  <h3 className="text-xl font-bold mb-4">Refill Details</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-gray-600 text-sm">Medication</p>
                      <p className="font-semibold">{refill.medicationName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Patient</p>
                      <p className="font-semibold">{refill.patientName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Patient Phone</p>
                      <p className="font-semibold">{refill.patientPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Requested On</p>
                      <p className="font-semibold">{new Date(refill.requestDate).toLocaleString()}</p>
                    </div>

                    {refill.approvalNote && (
                      <div className="bg-gray-100 p-3 rounded">
                        <p className="text-gray-600 text-sm">Approver Note</p>
                        <p className="text-sm mt-1">{refill.approvalNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Approval Form */}
                  {refill.status === 'PENDING' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Approval Note</label>
                        <textarea
                          value={approvalNote}
                          onChange={e => setApprovalNote(e.target.value)}
                          placeholder="Enter approval or rejection reason..."
                          className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRefill(refill.id)}
                          disabled={loading}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                        >
                          {loading ? '...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => handleRejectRefill(refill.id)}
                          disabled={loading}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-semibold"
                        >
                          {loading ? '...' : '❌ Reject'}
                        </button>
                      </div>
                    </div>
                  )}

                  {refill.status !== 'PENDING' && (
                    <div className="bg-gray-50 p-3 rounded text-center">
                      <p className="text-gray-600 text-sm">This refill has already been {refill.status.toLowerCase()}</p>
                    </div>
                  )}
                </div>
              ) : null;
            })()
          ) : (
            <div className="bg-gray-50 border rounded-lg p-6 text-center h-full flex items-center justify-center">
              <p className="text-gray-600">Select a refill to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PharmacyRefillApproval;

export default PharmacyRefillApproval;
