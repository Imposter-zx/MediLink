import { Injectable } from '@nestjs/common';

/**
 * Doctor profile
 */
export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialty: string;
  licensingNumber: string;
  hospital: string;
  phone: string;
  yearsOfExperience: number;
  patientCount: number;
  prescriptionCount: number;
  avgRating: number;
}

/**
 * Prescription
 */
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  strength: string;
  dosage: string;
  frequency: string;
  daysSupply: number;
  refills: number;
  indication: string;
  notes?: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'ACTIVE' | 'FILLED' | 'EXPIRED' | 'CANCELLED';
}

/**
 * Patient medical history
 */
export interface PatientMedicalHistory {
  patientId: string;
  allergies: string[];
  pastMedications: string[];
  chronicConditions: string[];
  surgeries: string[];
  lastVisit: Date;
  vitals: {
    bloodPressure: string;
    temperature: number;
    pulse: number;
    weight: number;
  };
}

/**
 * Doctor Service
 * Manages doctor profiles, prescription creation, and patient care
 */
@Injectable()
export class DoctorService {
  private doctors: Map<string, DoctorProfile> = new Map();
  private prescriptions: Map<string, Prescription> = new Map();
  private patientHistories: Map<string, PatientMedicalHistory> = new Map();
  private doctorPatients: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDoctors();
  }

  /**
   * Initialize default doctors
   */
  private initializeDoctors(): void {
    const defaultDoctors: DoctorProfile[] = [
      {
        id: 'dr-001',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        specialty: 'General Practitioner',
        licensingNumber: 'MD-12345',
        hospital: 'City Medical Center',
        phone: '+1-555-0101',
        yearsOfExperience: 15,
        patientCount: 245,
        prescriptionCount: 1200,
        avgRating: 4.8,
      },
      {
        id: 'dr-002',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        specialty: 'Cardiology',
        licensingNumber: 'MD-12346',
        hospital: 'City Medical Center',
        phone: '+1-555-0102',
        yearsOfExperience: 12,
        patientCount: 120,
        prescriptionCount: 890,
        avgRating: 4.9,
      },
    ];

    defaultDoctors.forEach(d => this.doctors.set(d.id, d));
  }

  /**
   * Get doctor profile
   */
  async getDoctorProfile(doctorId: string): Promise<DoctorProfile | null> {
    return this.doctors.get(doctorId) || null;
  }

  /**
   * Get doctor's patients
   */
  async getDoctorPatients(doctorId: string): Promise<any[]> {
    const patientIds = this.doctorPatients.get(doctorId) || [];
    // In production, fetch actual patient data
    return patientIds.map(id => ({ id, name: 'Patient Name' }));
  }

  /**
   * Create prescription
   */
  async createPrescription(
    patientId: string,
    medicationName: string,
    strength: string,
    dosage: string,
    frequency: string,
    daysSupply: number,
    refills: number,
    indication: string,
    notes?: string,
  ): Promise<Prescription> {
    const id = `rx-${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Prescriptions expire in 1 year

    const prescription: Prescription = {
      id,
      patientId,
      doctorId: 'dr-001', // TODO: Get from current user
      medicationName,
      strength,
      dosage,
      frequency,
      daysSupply,
      refills,
      indication,
      notes,
      createdAt: new Date(),
      expiresAt,
      status: 'ACTIVE',
    };

    this.prescriptions.set(id, prescription);
    console.log(`📋 Prescription created: ${id}`);

    return prescription;
  }

  /**
   * Get patient medical history
   */
  async getPatientMedicalHistory(patientId: string): Promise<PatientMedicalHistory> {
    return (
      this.patientHistories.get(patientId) || {
        patientId,
        allergies: [],
        pastMedications: [],
        chronicConditions: [],
        surgeries: [],
        lastVisit: new Date(),
        vitals: {
          bloodPressure: '120/80',
          temperature: 98.6,
          pulse: 72,
          weight: 70,
        },
      }
    );
  }

  /**
   * Get patient prescriptions
   */
  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values()).filter(p => p.patientId === patientId && p.status === 'ACTIVE');
  }

  /**
   * Update prescription
   */
  async updatePrescription(prescriptionId: string, updates: Partial<Prescription>): Promise<Prescription> {
    const prescription = this.prescriptions.get(prescriptionId);

    if (!prescription) {
      throw new Error(`Prescription ${prescriptionId} not found`);
    }

    Object.assign(prescription, updates);
    this.prescriptions.set(prescriptionId, prescription);

    console.log(`✏️ Prescription updated: ${prescriptionId}`);
    return prescription;
  }

  /**
   * Cancel prescription
   */
  async cancelPrescription(prescriptionId: string, reason: string): Promise<Prescription> {
    const prescription = this.prescriptions.get(prescriptionId);

    if (!prescription) {
      throw new Error(`Prescription ${prescriptionId} not found`);
    }

    prescription.status = 'CANCELLED';
    this.prescriptions.set(prescriptionId, prescription);

    console.log(`❌ Prescription cancelled: ${prescriptionId} - ${reason}`);
    return prescription;
  }

  /**
   * Update patient medical history
   */
  async updatePatientHistory(patientId: string, history: Partial<PatientMedicalHistory>): Promise<PatientMedicalHistory> {
    const existing = await this.getPatientMedicalHistory(patientId);
    const updated = { ...existing, ...history };

    this.patientHistories.set(patientId, updated);
    console.log(`📋 Patient history updated: ${patientId}`);

    return updated;
  }

  /**
   * Add allergy to patient
   */
  async addAllergy(patientId: string, allergy: string): Promise<PatientMedicalHistory> {
    const history = await this.getPatientMedicalHistory(patientId);

    if (!history.allergies.includes(allergy)) {
      history.allergies.push(allergy);
      this.patientHistories.set(patientId, history);
    }

    return history;
  }

  /**
   * Add chronic condition
   */
  async addChronicCondition(patientId: string, condition: string): Promise<PatientMedicalHistory> {
    const history = await this.getPatientMedicalHistory(patientId);

    if (!history.chronicConditions.includes(condition)) {
      history.chronicConditions.push(condition);
      this.patientHistories.set(patientId, history);
    }

    return history;
  }

  /**
   * Record vital signs
   */
  async recordVitals(
    patientId: string,
    bloodPressure: string,
    temperature: number,
    pulse: number,
    weight: number,
  ): Promise<PatientMedicalHistory> {
    const history = await this.getPatientMedicalHistory(patientId);

    history.vitals = {
      bloodPressure,
      temperature,
      pulse,
      weight,
    };

    history.lastVisit = new Date();
    this.patientHistories.set(patientId, history);

    console.log(`📊 Vitals recorded for patient: ${patientId}`);
    return history;
  }

  /**
   * Get doctor statistics
   */
  async getStats(doctorId: string): Promise<{
    activePatients: number;
    activePrescriptions: number;
    prescriptionsThisMonth: number;
    averageRefillTime: number;
    rating: number;
  }> {
    const doctor = await this.getDoctorProfile(doctorId);
    if (!doctor) throw new Error(`Doctor ${doctorId} not found`);

    const prescriptions = Array.from(this.prescriptions.values()).filter(p => p.doctorId === doctorId && p.status === 'ACTIVE');

    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    const prescriptionsThisMonth = Array.from(this.prescriptions.values()).filter(
      p => p.doctorId === doctorId && p.createdAt > thisMonth,
    ).length;

    return {
      activePatients: doctor.patientCount,
      activePrescriptions: prescriptions.length,
      prescriptionsThisMonth,
      averageRefillTime: 2, // days
      rating: doctor.avgRating,
    };
  }

  /**
   * Approve refill request
   */
  async approveRefillRequest(refillId: string, note?: string): Promise<any> {
    console.log(`✅ Refill approved by doctor: ${refillId}`);
    return {
      id: refillId,
      status: 'APPROVED',
      approverNote: note,
      approvedAt: new Date(),
    };
  }

  /**
   * Deny refill request
   */
  async denyRefillRequest(refillId: string, reason: string): Promise<any> {
    console.log(`❌ Refill denied by doctor: ${refillId} - ${reason}`);
    return {
      id: refillId,
      status: 'DENIED',
      reason,
      deniedAt: new Date(),
    };
  }

  /**
   * Recommend medication
   */
  async recommendMedication(patientId: string, medicationName: string, reason: string): Promise<any> {
    console.log(`💊 Medication recommended to patient ${patientId}: ${medicationName}`);
    return {
      patientId,
      medicationName,
      reason,
      recommendedAt: new Date(),
    };
  }
}
