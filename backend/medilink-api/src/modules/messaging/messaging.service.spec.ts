import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from './messaging.service';
import { FhirService } from '../../services/fhir.service';
import { EncryptionService } from '../../services/encryption.service';

describe('MessagingService', () => {
  let service: MessagingService;
  let fhirService: FhirService;
  let encryptionService: EncryptionService;

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
        MessagingService,
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

    service = module.get<MessagingService>(MessagingService);
    fhirService = module.get<FhirService>(FhirService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should encrypt content and create a Communication resource', async () => {
      const dto = {
        senderId: 'user-1',
        senderRole: 'patient',
        recipientId: 'user-2',
        content: 'Hello',
      };

      mockEncryptionService.encrypt.mockReturnValue({
        encrypted: 'encrypted-hex',
        iv: 'iv-hex',
        authTag: 'tag-hex',
      });

      mockFhirService.createResource.mockResolvedValue({ id: 'msg-1' });

      const result = await service.sendMessage(dto);

      expect(result.id).toBeDefined();
      expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('Hello');
      expect(mockFhirService.createResource).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceType: 'Communication',
          payload: [{ contentString: 'encrypted-hex' }],
        }),
      );
    });
  });

  describe('getConversation', () => {
    it('should retrieve and decrypt messages', async () => {
      const mockComm = {
        id: 'msg-1',
        sender: { reference: 'Patient/user-2' },
        recipient: [{ reference: 'Patient/user-1' }],
        payload: [{ contentString: 'enc-data' }],
        extension: [
          { url: 'encryption-iv', valueString: 'iv' },
          { url: 'encryption-auth-tag', valueString: 'tag' },
        ],
      };

      mockFhirService.searchResources.mockResolvedValue([mockComm]);
      mockEncryptionService.decrypt.mockReturnValue('Decrypted Hello');

      const result = await service.getConversation('user-1', 'user-2');

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Decrypted Hello');
      expect(mockEncryptionService.decrypt).toHaveBeenCalled();
    });
  });
});
