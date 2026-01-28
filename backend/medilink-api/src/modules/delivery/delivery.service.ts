import { Injectable } from '@nestjs/common';
import { FhirService } from '../../services/fhir.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto/delivery.dto';

/**
 * Delivery Service
 * Handles delivery task operations using FHIR Task resources
 */
@Injectable()
export class DeliveryService {
  constructor(private fhirService: FhirService) {}

  /**
   * Create delivery task
   */
  async create(dto: CreateDeliveryDto, pharmacyId: string) {
    // Get the prescription
    const prescription = await this.fhirService.readResource(
      'MedicationRequest',
      dto.prescriptionId,
    );

    const task = await this.fhirService.createResource({
      resourceType: 'Task',
      status: 'requested',
      intent: 'order',
      priority: dto.priority || 'routine',
      code: {
        coding: [
          {
            system: 'http://medilink.io/task-types',
            code: 'medication-delivery',
            display: 'Medication Delivery',
          },
        ],
      },
      focus: {
        reference: `MedicationRequest/${dto.prescriptionId}`,
      },
      for: (prescription as any).subject,
      authoredOn: new Date().toISOString(),
      requester: {
        reference: `Organization/${pharmacyId}`,
      },
      owner: dto.driverId
        ? {
            reference: `Practitioner/${dto.driverId}`,
          }
        : undefined,
      extension: [
        {
          url: 'http://medilink.io/fhir/StructureDefinition/delivery-id',
          valueString: `DEL-${Date.now()}`,
        },
        {
          url: 'http://medilink.io/fhir/StructureDefinition/delivery-instructions',
          valueString: dto.deliveryInstructions || '',
        },
        {
          url: 'http://medilink.io/fhir/StructureDefinition/delivery-address',
          valueString: dto.deliveryAddress,
        },
      ],
    });

    console.log(`✅ Delivery task created: ${task.id}`);
    return task;
  }

  /**
   * Find deliveries by driver
   */
  async findByDriver(driverId: string) {
    return this.fhirService.searchResources('Task', {
      owner: `Practitioner/${driverId}`,
      code: 'medication-delivery',
    });
  }

  /**
   * Find deliveries by patient
   */
  async findByPatient(patientId: string) {
    return this.fhirService.searchResources('Task', {
      for: `Patient/${patientId}`,
      code: 'medication-delivery',
    });
  }

  /**
   * Find deliveries by pharmacy
   */
  async findByPharmacy(pharmacyId: string) {
    return this.fhirService.searchResources('Task', {
      requester: `Organization/${pharmacyId}`,
      code: 'medication-delivery',
    });
  }

  /**
   * Find delivery by ID
   */
  async findById(id: string) {
    return this.fhirService.readResource('Task', id);
  }

  /**
   * Update delivery status
   */
  async updateStatus(id: string, dto: UpdateDeliveryDto, driverId: string) {
    const task = await this.fhirService.readResource('Task', id);

    // Update status
    (task as any).status = dto.status;
    (task as any).lastModified = new Date().toISOString();

    // Add output (ETA, location, etc.)
    if (dto.eta) {
      const output = (task as any).output || [];
      output.push({
        type: {
          coding: [
            {
              system: 'http://medilink.io/task-outputs',
              code: 'eta',
              display: 'Estimated Time of Arrival',
            },
          ],
        },
        valueDateTime: dto.eta,
      });
      (task as any).output = output;
    }

    if (dto.currentLocation) {
      const output = (task as any).output || [];
      output.push({
        type: {
          coding: [
            {
              system: 'http://medilink.io/task-outputs',
              code: 'location',
              display: 'Current Location',
            },
          ],
        },
        valueString: dto.currentLocation,
      });
      (task as any).output = output;
    }

    const updated = await this.fhirService.updateResource(task);

    // Create provenance
    await this.fhirService.createResource({
      resourceType: 'Provenance',
      target: [{ reference: `Task/${id}` }],
      recorded: new Date().toISOString(),
      agent: [
        {
          who: { reference: `Practitioner/${driverId}` },
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
          valueString: dto.status,
        },
      ],
    });

    console.log(`✅ Delivery ${id} updated to: ${dto.status}`);
    return updated;
  }

  /**
   * Assign delivery to driver
   */
  async assignDriver(taskId: string, driverId: string) {
    const task = await this.fhirService.readResource('Task', taskId);

    (task as any).owner = {
      reference: `Practitioner/${driverId}`,
    };
    (task as any).status = 'accepted';

    const updated = await this.fhirService.updateResource(task);

    console.log(`✅ Delivery ${taskId} assigned to driver: ${driverId}`);
    return updated;
  }
}
