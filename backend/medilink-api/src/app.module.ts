import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { AuditModule } from './modules/audit/audit.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { RateLimitService } from './common/middleware/rate-limit.service';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM database connection
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        if (!url || url.includes('[YOUR_DATABASE_PASSWORD]')) {
          console.warn('⚠️ DATABASE_URL is not configured properly or still has placeholder. Database integration may not work.');
        }
        return {
          type: 'postgres',
          url: url && !url.includes('[YOUR_DATABASE_PASSWORD]') ? url : 'postgresql://postgres:postgres@localhost:5432/medilink',
          autoLoadEntities: true,
          synchronize: true, // Autocreate schema for development
          ssl: url && !url.includes('localhost') && !url.includes('127.0.0.1') ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    // Global services (FHIR, Encryption, Geolocation, Notifications, etc.)
    ServicesModule,
    // Audit module
    AuditModule,
    // Authentication
    AuthModule,
    // Core business modules
    PrescriptionsModule,
    PatientsModule,
    DeliveryModule,
    // Doctor EHR Integration
    DoctorModule,
    // Real-time messaging
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService, RateLimitService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('api');
  }
}
