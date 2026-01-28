import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { FhirService } from '../../services/fhir.service';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let fhirService: FhirService;

  const mockFhirService = {
    createResource: jest.fn(),
    searchResources: jest.fn(),
    readResource: jest.fn(),
    updateResource: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: FhirService,
          useValue: mockFhirService,
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    fhirService = module.get<FhirService>(FhirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDelivery', () => {
    it('should create a Task resource for delivery', async () => {
      const dto = {
        prescriptionId: 'rx-1',
        patientId: 'pat-1',
        pharmacyId: 'pharm-1',
        deliveryAddress: '123 St',
        instructions: 'Leave at gate',
      };

      mockFhirService.createResource.mockResolvedValue({ id: 'task-1' });

      const result = await service.createDelivery(dto);

      expect(result).toEqual({ id: 'task-1' });
      expect(mockFhirService.createResource).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceType: 'Task',
          focus: { reference: 'MedicationRequest/rx-1' },
          for: { reference: 'Patient/pat-1' },
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const mockTask = {
        resourceType: 'Task',
        id: 'task-1',
        status: 'requested',
      };

      mockFhirService.readResource.mockResolvedValue(mockTask);
      mockFhirService.updateResource.mockResolvedValue({ ...mockTask, status: 'in-progress' });

      const result = await service.updateStatus('task-1', 'in-progress', 'driver-1');

      expect(result.status).toBe('in-progress');
      expect(mockFhirService.updateResource).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'in-progress' }),
      );
    });
  });
});
