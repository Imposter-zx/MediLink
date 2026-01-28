import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { MessagingModule } from './modules/messaging/messaging.module';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Global services (FHIR, Encryption)
    ServicesModule,
    // Authentication
    AuthModule,
    // Core business modules
    PrescriptionsModule,
    PatientsModule,
    DeliveryModule,
    // Real-time messaging
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
