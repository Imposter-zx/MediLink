import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionsService } from './prescriptions.service';
import { FhirService } from '../../services/fhir.service';
import { EncryptionService } from '../../services/encryption.service';

describe('PrescriptionsService', () => {
  let service: PrescriptionsService;
  let fhirService: FhirService;

  const mockFhirService = {
    createResource: jest.fn(),
    searchResources: jest.fn(),
    readResource: jest.fn(),
    updateResource: jest.fn(),
  };

  const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionsService,
        {
          provide: FhirService,
          useValue: mockFhirService,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<PrescriptionsService>(PrescriptionsService);
    fhirService = module.get<FhirService>(FhirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPrescription', () => {
    it('should create a MedicationRequest resource', async () => {
      const dto = {
        patientId: 'patient-1',
        medicationName: 'Amoxicillin',
        medicationCode: '123',
        dosageInstructions: '1 daily',
        quantity: 30,
        unit: 'capsules',
        frequency: 1,
        refills: 0,
      };

      mockFhirService.createResource.mockResolvedValue({ id: 'rx-1' });

      const result = await service.createPrescription(dto, 'doctor-1');

      expect(result).toEqual({ id: 'rx-1' });
      expect(mockFhirService.createResource).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceType: 'MedicationRequest',
          subject: { reference: 'Patient/patient-1' },
        }),
      );
    });
  });

  describe('getPrescriptions', () => {
    it('should search for MedicationRequest resources', async () => {
      mockFhirService.searchResources.mockResolvedValue([]);

      const result = await service.getPrescriptions('patient', 'patient-1');

      expect(result).toEqual([]);
      expect(mockFhirService.searchResources).toHaveBeenCalledWith(
        'MedicationRequest',
        { subject: 'Patient/patient-1' },
      );
    });
  });
});
