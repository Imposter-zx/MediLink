import { Module, Global } from '@nestjs/common';
import { FhirService } from './fhir.service';
import { EncryptionService } from './encryption.service';
import { GeolocationService } from './geolocation.service';
import { MedicationSearchService } from './medication-search.service';
import { NotificationService } from './notification.service';

/**
 * Services Module - Shared services available globally
 */
@Global()
@Module({
  providers: [FhirService, EncryptionService, GeolocationService, MedicationSearchService, NotificationService],
  exports: [FhirService, EncryptionService, GeolocationService, MedicationSearchService, NotificationService],
})
export class ServicesModule {}
