import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FhirService } from '../../services/fhir.service';
import type { SessionData } from '../../common/types/session.types';
import { CreatePrescriptionDto } from './dto/prescription.dto';

/**
 * Prescriptions Service
 * Handles business logic for medication prescriptions
 */
@Injectable()
export class PrescriptionsService {
  constructor(private fhirService: FhirService) {}

  /**
   * Create a new prescription (MedicationRequest)
   */
  async create(dto: CreatePrescriptionDto, requesterId: string) {
    const medicationRequest = await this.fhirService.createResource({
      resourceType: 'MedicationRequest',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
            code: dto.medicationCode,
            display: dto.medicationName,
          },
        ],
        text: dto.medicationName,
      },
      subject: {
        reference: `Patient/${dto.patientId}`,
      },
      requester: {
        reference: `Practitioner/${requesterId}`,
      },
      dosageInstruction: [
        {
          text: dto.dosageInstructions,
          timing: {
            repeat: {
              frequency: dto.frequency,
              period: 1,
              periodUnit: 'd',
            },
          },
        },
      ],
      dispenseRequest: {
        numberOfRepeatsAllowed: dto.refills || 0,
        quantity: {
          value: dto.quantity,
          unit: dto.unit || 'tablets',
        },
        performer: dto.pharmacyId
          ? {
              reference: `Organization/${dto.pharmacyId}`,
            }
          : undefined,
      },
      extension: [
        {
          url: 'http://medilink.io/fhir/StructureDefinition/medilink-order-id',
          valueString: `RX-${Date.now()}`,
        },
      ],
    });

    // Create provenance
    await this.fhirService.createResource({
      resourceType: 'Provenance',
      target: [{ reference: `MedicationRequest/${medicationRequest.id}` }],
      recorded: new Date().toISOString(),
      agent: [
        {
          who: { reference: `Practitioner/${requesterId}` },
        },
      ],
      activity: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-DataOperation',
            code: 'CREATE',
          },
        ],
      },
    });

    console.log(`✅ Prescription created: ${medicationRequest.id}`);
    return medicationRequest;
  }

  /**
   * Find prescriptions by patient ID
   */
  async findByPatient(patientId: string, status?: string) {
    const query: any = {
      subject: `Patient/${patientId}`,
    };

    if (status) {
      query.status = status;
    }

    return this.fhirService.searchResources('MedicationRequest', query);
  }

  /**
   * Find prescriptions by pharmacy ID
   */
  async findByPharmacy(pharmacyId: string, status?: string) {
    const query: any = {
      performer: `Organization/${pharmacyId}`,
    };

    if (status) {
      query.status = status;
    }

    return this.fhirService.searchResources('MedicationRequest', query);
  }

  /**
   * Find prescription by ID with authorization check
   */
  async findById(id: string, session: SessionData) {
    const prescription = await this.fhirService.readResource(
      'MedicationRequest',
      id,
    );

    // Authorization check
    if (session.role === 'patient') {
      const patientRef = (prescription as any).subject?.reference;
      if (patientRef !== `Patient/${session.userId}`) {
        throw new ForbiddenException('Access denied to this prescription');
      }
    } else if (session.role === 'pharmacy') {
      const pharmacyRef = (prescription as any).dispenseRequest?.performer?.reference;
      if (pharmacyRef !== `Organization/${session.organizationId}`) {
        throw new ForbiddenException('Access denied to this prescription');
      }
    }

    return prescription;
  }

  /**
   * Update prescription status
   */
  async updateStatus(
    id: string,
    newStatus: string,
    notes: string,
    pharmacistId: string,
  ) {
    const prescription = await this.fhirService.readResource(
      'MedicationRequest',
      id,
    );

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Update status
    (prescription as any).status = newStatus;
    
    // Add note if provided
    if (notes) {
      (prescription as any).note = [
        ...((prescription as any).note || []),
        {
          text: notes,
          time: new Date().toISOString(),
        },
      ];
    }

    const updated = await this.fhirService.updateResource(prescription);

    // Create provenance for status change
    await this.fhirService.createResource({
      resourceType: 'Provenance',
      target: [{ reference: `MedicationRequest/${id}` }],
      recorded: new Date().toISOString(),
      agent: [
        {
          who: { reference: `Practitioner/${pharmacistId}` },
        },
      ],
      activity: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-DataOperation',
            code: 'UPDATE',
          },
        ],
      },
      extension: [
        {
          url: 'http://medilink.io/fhir/StructureDefinition/status-change',
          valueString: newStatus,
        },
      ],
    });

    console.log(`✅ Prescription ${id} status updated to: ${newStatus}`);
    return updated;
  }
}
