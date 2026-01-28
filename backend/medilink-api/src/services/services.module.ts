import { Module, Global } from '@nestjs/common';
import { FhirService } from './fhir.service';
import { EncryptionService } from './encryption.service';

/**
 * Services Module - Shared services available globally
 */
@Global()
@Module({
  providers: [FhirService, EncryptionService],
  exports: [FhirService, EncryptionService],
})
export class ServicesModule {}
