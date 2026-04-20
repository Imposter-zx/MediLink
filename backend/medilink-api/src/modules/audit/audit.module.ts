import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Module({
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService], // Export so other modules can use it
})
export class AuditModule {}
