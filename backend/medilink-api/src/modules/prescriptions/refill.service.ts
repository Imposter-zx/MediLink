import { Injectable } from '@nestjs/common';

/**
 * Prescription Refill Request
 */
export interface RefillRequest {
  id: string;
  prescriptionId: string;
  patientId: string;
  pharmacyId: string;
  medicationName: string;
  currentQuantity: number;
  quantityRequested: number;
  daysSupply: number;
  requestDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  approvalDate?: Date;
  approverNote?: string;
  expiryDate: Date;
}

/**
 * Prescription Refill Service
 * Manages refill requests and approval workflows
 */
@Injectable()
export class RefillService {
  private refills: Map<string, RefillRequest> = new Map();

  /**
   * Create a new refill request
   */
  async createRefillRequest(
    prescriptionId: string,
    patientId: string,
    pharmacyId: string,
    medicationName: string,
    currentQuantity: number,
    quantityRequested: number,
    daysSupply: number,
  ): Promise<RefillRequest> {
    const id = `refill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Refill request valid for 30 days

    const refill: RefillRequest = {
      id,
      prescriptionId,
      patientId,
      pharmacyId,
      medicationName,
      currentQuantity,
      quantityRequested,
      daysSupply,
      requestDate: new Date(),
      status: 'PENDING',
      expiryDate,
    };

    this.refills.set(id, refill);
    console.log(`✅ Refill request created: ${id}`);

    return refill;
  }

  /**
   * Get refill request by ID
   */
  async getRefillRequest(refillId: string): Promise<RefillRequest | null> {
    return this.refills.get(refillId) || null;
  }

  /**
   * Get all refill requests for a patient
   */
  async getPatientRefills(patientId: string): Promise<RefillRequest[]> {
    return Array.from(this.refills.values()).filter(r => r.patientId === patientId);
  }

  /**
   * Get all pending refill requests for a pharmacy
   */
  async getPendingRefillsForPharmacy(pharmacyId: string): Promise<RefillRequest[]> {
    return Array.from(this.refills.values()).filter(r => r.pharmacyId === pharmacyId && r.status === 'PENDING');
  }

  /**
   * Approve refill request
   */
  async approveRefill(refillId: string, approverNote?: string): Promise<RefillRequest> {
    const refill = this.refills.get(refillId);

    if (!refill) {
      throw new Error(`Refill request ${refillId} not found`);
    }

    refill.status = 'APPROVED';
    refill.approvalDate = new Date();
    refill.approverNote = approverNote;

    this.refills.set(refillId, refill);
    console.log(`✅ Refill approved: ${refillId}`);

    return refill;
  }

  /**
   * Reject refill request
   */
  async rejectRefill(refillId: string, reason: string): Promise<RefillRequest> {
    const refill = this.refills.get(refillId);

    if (!refill) {
      throw new Error(`Refill request ${refillId} not found`);
    }

    refill.status = 'REJECTED';
    refill.approvalDate = new Date();
    refill.approverNote = reason;

    this.refills.set(refillId, refill);
    console.log(`❌ Refill rejected: ${refillId} - ${reason}`);

    return refill;
  }

  /**
   * Get refill history for a prescription
   */
  async getPrescriptionRefillHistory(prescriptionId: string): Promise<RefillRequest[]> {
    return Array.from(this.refills.values()).filter(r => r.prescriptionId === prescriptionId);
  }

  /**
   * Check if prescription is eligible for refill
   */
  async isEligibleForRefill(prescriptionId: string, _medicationName: string): Promise<boolean> {
    const refills = await this.getPrescriptionRefillHistory(prescriptionId);

    // Must have at least 1 day supply remaining before refill
    const latestPrescription = refills[refills.length - 1];
    if (!latestPrescription) return true;

    // Check if enough time has passed since last fill
    const daysSinceFill = Math.floor((Date.now() - latestPrescription.requestDate.getTime()) / (1000 * 60 * 60 * 24));

    return daysSinceFill >= latestPrescription.daysSupply - 7; // Can refill 7 days early
  }

  /**
   * Get statistics for refill management
   */
  async getRefillStats(pharmacyId: string): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  }> {
    const refills = Array.from(this.refills.values()).filter(r => r.pharmacyId === pharmacyId);

    return {
      pending: refills.filter(r => r.status === 'PENDING').length,
      approved: refills.filter(r => r.status === 'APPROVED').length,
      rejected: refills.filter(r => r.status === 'REJECTED').length,
      total: refills.length,
    };
  }

  /**
   * Auto-expire old refill requests
   */
  async expireOldRefills(): Promise<number> {
    let expiredCount = 0;
    const now = new Date();

    for (const [id, refill] of this.refills.entries()) {
      if (refill.status === 'PENDING' && refill.expiryDate < now) {
        refill.status = 'EXPIRED';
        this.refills.set(id, refill);
        expiredCount++;
      }
    }

    return expiredCount;
  }
}
