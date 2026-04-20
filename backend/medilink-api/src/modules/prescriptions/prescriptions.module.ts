import { Module } from '@nestjs/common';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';
import { RefillService } from './refill.service';

@Module({
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService, RefillService],
  exports: [PrescriptionsService, RefillService],
})
export class PrescriptionsModule {}
