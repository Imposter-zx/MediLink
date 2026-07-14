import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

/**
 * Doctor Dashboard Component
 * Complete EHR (Electronic Health Record) system for doctors
 */
function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [patientHistory, setPatientHistory] = useState(null);
  const [stats, setStats] = useState({ activePatients: 0, activePrescriptions: 0, prescriptionsThisMonth: 0, avgRefillTime: 0, rating: 0 });
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

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
        setNotification({ type: 'success', message: 'Prescription created successfully' });
        setShowPrescriptionForm(false);
        loadDashboard();
      } else {
        setNotification({ type: 'error', message: 'Failed to create prescription' });
      }
    } catch (error) {
      console.error('Failed to create prescription:', error);
      setNotification({ type: 'error', message: 'Failed to create prescription' });
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
        setNotification({ type: 'success', message: 'Vitals recorded successfully' });
        loadPatientHistory(patientId);
      } else {
        setNotification({ type: 'error', message: 'Failed to record vitals' });
      }
     } catch (error) {
       console.error('Failed to record vitals:', error);
       setNotification({ type: 'error', message: 'Failed to record vitals' });
     }
   };
 
   return (
      <div className="max-w-7xl mx-auto p-6">
        {notification && (
          <div className={`mb-4 p-4 rounded-lg border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{notification.message}</p>
              <button onClick={() => setNotification(null)} className="text-current opacity-60 hover:opacity-100">&times;</button>
            </div>
          </div>
        )}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6">Doctor Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active Patients</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.activePatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active Prescriptions</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.activePrescriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">This Month</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">{stats.prescriptionsThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Patient Rating</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.rating.toFixed(1)} ⭐
            </div>
          </CardContent>
        </Card>
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
            {patients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="font-medium">No patients assigned</p>
                <p className="text-sm mt-1">Patient list will appear once patients are assigned to you</p>
              </div>
            ) : patients.map(patient => (
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
            onSubmit={async (vitals) => {
              await onRecordVitals(patient.id, vitals);
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
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId.trim()) newErrors.patientId = 'Required';
    if (!formData.medicationName.trim()) newErrors.medicationName = 'Required';
    if (!formData.strength.trim()) newErrors.strength = 'Required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch {
      console.error('Prescription submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input type="text" placeholder="Patient ID" value={formData.patientId} onChange={e => { setFormData({ ...formData, patientId: e.target.value }); setErrors({ ...errors, patientId: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.patientId ? 'border-red-500' : ''}`} />
            {errors.patientId && <p className="text-xs text-red-600 mt-1">{errors.patientId}</p>}
          </div>
          <div>
            <input type="text" placeholder="Medication Name" value={formData.medicationName} onChange={e => { setFormData({ ...formData, medicationName: e.target.value }); setErrors({ ...errors, medicationName: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.medicationName ? 'border-red-500' : ''}`} />
            {errors.medicationName && <p className="text-xs text-red-600 mt-1">{errors.medicationName}</p>}
          </div>
          <div>
            <input type="text" placeholder="Strength (e.g., 10mg)" value={formData.strength} onChange={e => { setFormData({ ...formData, strength: e.target.value }); setErrors({ ...errors, strength: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.strength ? 'border-red-500' : ''}`} />
            {errors.strength && <p className="text-xs text-red-600 mt-1">{errors.strength}</p>}
          </div>
          <div>
            <input type="text" placeholder="Dosage (e.g., 1 tablet)" value={formData.dosage} onChange={e => { setFormData({ ...formData, dosage: e.target.value }); setErrors({ ...errors, dosage: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.dosage ? 'border-red-500' : ''}`} />
            {errors.dosage && <p className="text-xs text-red-600 mt-1">{errors.dosage}</p>}
          </div>
          <select value={formData.frequency} onChange={e => setFormData({ ...formData, frequency: e.target.value })} className="w-full px-3 py-2 border rounded">
            <option>once daily</option>
            <option>twice daily</option>
            <option>three times daily</option>
            <option>as needed</option>
          </select>
          <input type="number" placeholder="Days Supply" value={formData.daysSupply} onChange={e => setFormData({ ...formData, daysSupply: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded" />
          <textarea placeholder="Indication/Reason" value={formData.indication} onChange={e => setFormData({ ...formData, indication: e.target.value })} className="col-span-2 px-3 py-2 border rounded" rows={3} />
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSubmit} isLoading={submitting} className="flex-1">
            {submitting ? 'Creating...' : 'Create Prescription'}
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vitals Form Component
 */
function VitalsForm({ onSubmit, onCancel }) {
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    temperature: '',
    pulse: '',
    weight: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!vitals.bloodPressure.trim()) newErrors.bloodPressure = 'Required';
    if (!vitals.temperature) newErrors.temperature = 'Required';
    if (!vitals.pulse) newErrors.pulse = 'Required';
    if (!vitals.weight) newErrors.weight = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(vitals);
    } catch {
      console.error('Vitals submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input type="text" placeholder="BP (e.g., 120/80)" value={vitals.bloodPressure} onChange={e => { setVitals({ ...vitals, bloodPressure: e.target.value }); setErrors({ ...errors, bloodPressure: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.bloodPressure ? 'border-red-500' : ''}`} />
            {errors.bloodPressure && <p className="text-xs text-red-600 mt-1">{errors.bloodPressure}</p>}
          </div>
          <div>
            <input type="number" placeholder="Temperature (°F)" value={vitals.temperature} onChange={e => { setVitals({ ...vitals, temperature: e.target.value }); setErrors({ ...errors, temperature: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.temperature ? 'border-red-500' : ''}`} />
            {errors.temperature && <p className="text-xs text-red-600 mt-1">{errors.temperature}</p>}
          </div>
          <div>
            <input type="number" placeholder="Heart Rate (bpm)" value={vitals.pulse} onChange={e => { setVitals({ ...vitals, pulse: e.target.value }); setErrors({ ...errors, pulse: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.pulse ? 'border-red-500' : ''}`} />
            {errors.pulse && <p className="text-xs text-red-600 mt-1">{errors.pulse}</p>}
          </div>
          <div>
            <input type="number" placeholder="Weight (lbs)" value={vitals.weight} onChange={e => { setVitals({ ...vitals, weight: e.target.value }); setErrors({ ...errors, weight: '' }); }} className={`w-full px-3 py-2 border rounded ${errors.weight ? 'border-red-500' : ''}`} />
            {errors.weight && <p className="text-xs text-red-600 mt-1">{errors.weight}</p>}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button onClick={handleSubmit} isLoading={submitting} className="flex-1">
            {submitting ? 'Saving...' : 'Record Vitals'}
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
