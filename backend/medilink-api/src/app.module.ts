import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './modules/auth/auth.module';

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
    // Future modules
    // PatientsModule,
    // PrescriptionsModule,
    // MessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
