import { Injectable, ForbiddenException } from '@nestjs/common';
import { FhirService } from '../../services/fhir.service';
import type { SessionData } from '../../common/types/session.types';
import { UpdatePatientDto } from './dto/patient.dto';

/**
 * Patients Service
 * Handles patient profile operations
 */
@Injectable()
export class PatientsService {
  constructor(private fhirService: FhirService) {}

  /**
   * Get patient profile with authorization
   */
  async getProfile(patientId: string, session: SessionData) {
    const patient = await this.fhirService.readResource('Patient', patientId);

    // Authorization check
    if (session.role === 'patient' && patientId !== session.userId) {
      throw new ForbiddenException('Access denied to this patient profile');
    }

    return patient;
  }

  /**
   * Update patient profile
   */
  async updateProfile(patientId: string, dto: UpdatePatientDto) {
    const patient = await this.fhirService.readResource('Patient', patientId);

    // Update fields
    if (dto.phone) {
      const telecom = (patient as any).telecom || [];
      const phoneIndex = telecom.findIndex((t: any) => t.system === 'phone');
      
      if (phoneIndex >= 0) {
        telecom[phoneIndex].value = dto.phone;
      } else {
        telecom.push({ system: 'phone', value: dto.phone, use: 'mobile' });
      }
      (patient as any).telecom = telecom;
    }

    if (dto.email) {
      const telecom = (patient as any).telecom || [];
      const emailIndex = telecom.findIndex((t: any) => t.system === 'email');
      
      if (emailIndex >= 0) {
        telecom[emailIndex].value = dto.email;
      } else {
        telecom.push({ system: 'email', value: dto.email });
      }
      (patient as any).telecom = telecom;
    }

    if (dto.address) {
      (patient as any).address = [
        {
          use: 'home',
          line: [dto.address.street],
          city: dto.address.city,
          state: dto.address.state,
          postalCode: dto.address.postalCode,
        },
      ];
    }

    // Update extensions for medical preferences
    if (dto.preferredPharmacyId) {
      const extensions = (patient as any).extension || [];
      const pharmacyExtIndex = extensions.findIndex(
        (e: any) => e.url === 'http://medilink.io/fhir/StructureDefinition/preferred-pharmacy',
      );

      if (pharmacyExtIndex >= 0) {
        extensions[pharmacyExtIndex].valueReference = {
          reference: `Organization/${dto.preferredPharmacyId}`,
        };
      } else {
        extensions.push({
          url: 'http://medilink.io/fhir/StructureDefinition/preferred-pharmacy',
          valueReference: {
            reference: `Organization/${dto.preferredPharmacyId}`,
          },
        });
      }
      (patient as any).extension = extensions;
    }

    const updated = await this.fhirService.updateResource(patient);

    // Create provenance
    await this.fhirService.createResource({
      resourceType: 'Provenance',
      target: [{ reference: `Patient/${patientId}` }],
      recorded: new Date().toISOString(),
      agent: [
        {
          who: { reference: `Patient/${patientId}` },
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
    });

    console.log(`✅ Patient profile updated: ${patientId}`);
    return updated;
  }
}
