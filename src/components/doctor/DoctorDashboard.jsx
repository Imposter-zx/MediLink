import React, { useState, useEffect } from 'react';

/**
 * Doctor Dashboard Component
 * Complete EHR (Electronic Health Record) system for doctors
 */
function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [stats, setStats] = useState({ activePatients: 0, activePrescriptions: 0, prescriptionsThisMonth: 0, avgRefillTime: 0, rating: 0 });
  const [loading, setLoading] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  // Load doctor data on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  /**
   * Load dashboard data
   */
  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Load doctor stats
      const statsResponse = await fetch('/api/doctor/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Load patients list
      const patientsResponse = await fetch('/api/doctor/patients');
      const patientsData = await patientsResponse.json();
      setPatients(patientsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load patient medical history
   */
  const loadPatientHistory = async (patientId) => {
    try {
      const response = await fetch(`/api/doctor/patient/${patientId}/history`);
      const data = await response.json();
      setPatientHistory(data);
      setSelectedPatient(patientId);
      setActiveTab('history');
    } catch (error) {
      console.error('Failed to load patient history:', error);
    }
  };

  /**
   * Create new prescription
   */
  const handleCreatePrescription = async (formData) => {
    try {
      const response = await fetch('/api/doctor/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('✅ Prescription created successfully');
        setShowPrescriptionForm(false);
        loadDashboard();
      }
    } catch (error) {
      console.error('Failed to create prescription:', error);
      alert('Failed to create prescription');
    }
  };

  /**
   * Record vital signs
   */
  const handleRecordVitals = async (patientId, vitals) => {
    try {
      const response = await fetch(`/api/doctor/patient/${patientId}/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitals),
      });

      if (response.ok) {
        alert('✅ Vitals recorded successfully');
        loadPatientHistory(patientId);
      }
    } catch (error) {
      console.error('Failed to record vitals:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Doctor Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Active Patients</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{stats.activePatients}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Active Prescriptions</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.activePrescriptions}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">This Month</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">{stats.prescriptionsThisMonth}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Patient Rating</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">
            {stats.rating.toFixed(1)} ⭐
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('patients')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'patients'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Patients
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'prescriptions'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('refills')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'refills'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Refill Approvals
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-4 font-semibold ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Patient Record
        </button>
      </div>

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Your Patients ({patients.length})</h3>
            <input
              type="text"
              placeholder="Search patients..."
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            {patients.map(patient => (
              <div
                key={patient.id}
                onClick={() => loadPatientHistory(patient.id)}
                className="bg-white border rounded-lg p-4 hover:shadow-lg cursor-pointer transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{patient.name}</h4>
                    <p className="text-gray-600">DOB: {patient.dateOfBirth}</p>
                    <p className="text-sm text-gray-500 mt-1">ID: {patient.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last Visit</p>
                    <p className="font-semibold">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Create Prescription
          </button>

          {showPrescriptionForm && (
            <PrescriptionForm onSubmit={handleCreatePrescription} onCancel={() => setShowPrescriptionForm(false)} />
          )}

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Prescriptions</h3>
            {/* Prescription list would go here */}
          </div>
        </div>
      )}

      {/* Refill Approvals Tab */}
      {activeTab === 'refills' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Pending Refill Requests</h3>
          {/* Refill approval list would go here */}
        </div>
      )}

      {/* Patient Record Tab */}
      {activeTab === 'history' && patientHistory && (
        <PatientRecordView patient={patientHistory} onRecordVitals={handleRecordVitals} />
      )}
    </div>
  );
}

export default DoctorDashboard;

/**
 * Patient Record View Component
 */
function PatientRecordView({ patient, onRecordVitals }) {
  const [showVitalsForm, setShowVitalsForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">{patient.name}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Date of Birth</p>
            <p className="font-semibold">{patient.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Medical Record ID</p>
            <p className="font-semibold">{patient.id}</p>
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-3">Allergies</h4>
        {patient.medicalHistory.allergies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {patient.medicalHistory.allergies.map((allergy) => (
              <span key={allergy} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                {allergy}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No known allergies</p>
        )}
      </div>

      {/* Chronic Conditions */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-3">Chronic Conditions</h4>
        {patient.medicalHistory.chronicConditions.length > 0 ? (
          <ul className="space-y-2">
            {patient.medicalHistory.chronicConditions.map((condition) => (
              <li key={condition} className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                {condition}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No chronic conditions recorded</p>
        )}
      </div>

      {/* Vitals */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Latest Vitals</h4>
          <button
            onClick={() => setShowVitalsForm(!showVitalsForm)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Record Vitals
          </button>
        </div>

        {showVitalsForm && (
          <VitalsForm
            patientId={patient.id}
            onSubmit={(vitals) => {
              onRecordVitals(patient.id, vitals);
              setShowVitalsForm(false);
            }}
            onCancel={() => setShowVitalsForm(false)}
          />
        )}

        {patient.medicalHistory.latestVitals && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 text-sm">Blood Pressure</p>
              <p className="font-semibold">{patient.medicalHistory.latestVitals.bloodPressure}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Temperature</p>
              <p className="font-semibold">{patient.medicalHistory.latestVitals.temperature}°F</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Heart Rate</p>
              <p className="font-semibold">{patient.medicalHistory.latestVitals.pulse} bpm</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Weight</p>
              <p className="font-semibold">{patient.medicalHistory.latestVitals.weight} lbs</p>
            </div>
          </div>
        )}
      </div>

      {/* Current Prescriptions */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-3">Current Medications</h4>
        {patient.activePrescriptions && patient.activePrescriptions.length > 0 ? (
          <div className="space-y-3">
            {patient.activePrescriptions.map((prescription) => (
              <div key={prescription.id} className="border-b pb-3 last:border-b-0">
                <p className="font-semibold">{prescription.medicationName}</p>
                <p className="text-sm text-gray-600">{prescription.dosage} {prescription.frequency}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No current medications</p>
        )}
      </div>
    </div>
  );
}

/**
 * Prescription Creation Form Component
 */
function PrescriptionForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    patientId: '',
    medicationName: '',
    strength: '',
    dosage: '',
    frequency: 'once daily',
    daysSupply: 30,
    refills: 3,
    indication: '',
  });

  return (
    <div className="bg-white border rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Create New Prescription</h3>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Patient ID" className="px-3 py-2 border rounded" />
        <input
          type="text"
          placeholder="Medication Name"
          value={formData.medicationName}
          onChange={e => setFormData({ ...formData, medicationName: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Strength (e.g., 10mg)"
          value={formData.strength}
          onChange={e => setFormData({ ...formData, strength: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Dosage (e.g., 1 tablet)"
          value={formData.dosage}
          onChange={e => setFormData({ ...formData, dosage: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <select
          value={formData.frequency}
          onChange={e => setFormData({ ...formData, frequency: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option>once daily</option>
          <option>twice daily</option>
          <option>three times daily</option>
          <option>as needed</option>
        </select>
        <input
          type="number"
          placeholder="Days Supply"
          value={formData.daysSupply}
          onChange={e => setFormData({ ...formData, daysSupply: parseInt(e.target.value) })}
          className="px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Indication/Reason"
          value={formData.indication}
          onChange={e => setFormData({ ...formData, indication: e.target.value })}
          className="col-span-2 px-3 py-2 border rounded"
          rows={3}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onSubmit(formData)}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Create Prescription
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Vitals Form Component
 */
function VitalsForm({ patientId, onSubmit, onCancel }) {
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    temperature: '',
    pulse: '',
    weight: '',
  });

  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="BP (e.g., 120/80)"
          value={vitals.bloodPressure}
          onChange={e => setVitals({ ...vitals, bloodPressure: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Temperature (°F)"
          value={vitals.temperature}
          onChange={e => setVitals({ ...vitals, temperature: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Heart Rate (bpm)"
          value={vitals.pulse}
          onChange={e => setVitals({ ...vitals, pulse: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Weight (lbs)"
          value={vitals.weight}
          onChange={e => setVitals({ ...vitals, weight: e.target.value })}
          className="px-3 py-2 border rounded"
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onSubmit(vitals)}
          className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
        >
          Record Vitals
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded text-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DoctorDashboard;
