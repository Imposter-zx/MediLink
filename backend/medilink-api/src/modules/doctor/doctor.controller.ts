import { Controller, Post, Get, Patch, Body, Query, UseGuards, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

export class CreatePrescriptionDto {
  patientId!: string;
  medicationName!: string;
  strength!: string;
  dosage!: string;
  frequency!: string;
  daysSupply!: number;
  refills!: number;
  indication!: string;
  notes?: string;
}

@Controller('api/doctor')
@UseGuards(AuthGuard, RolesGuard)
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Get doctor profile
   */
  @Get('profile/:doctorId')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async getDoctorProfile(@Query('doctorId') doctorId: string) {
    const profile = await this.doctorService.getDoctorProfile(doctorId);
    if (!profile) {
      throw new NotFoundException(`Doctor ${doctorId} not found`);
    }
    return profile;
  }

  /**
   * Create new prescription
   */
  @Post('prescriptions')
  @Roles('doctor')
  @HttpCode(HttpStatus.CREATED)
  async createPrescription(@Body() dto: CreatePrescriptionDto) {
    const prescription = await this.doctorService.createPrescription(
      dto.patientId,
      dto.medicationName,
      dto.strength,
      dto.dosage,
      dto.frequency,
      dto.daysSupply,
      dto.refills,
      dto.indication,
      dto.notes,
    );

    // Log the prescription creation
    await this.auditService.logCreate('DOCTOR', 'doctor@medilink.com', 'doctor', 'Prescription', prescription.id, `Created prescription for patient ${dto.patientId}`);

    return prescription;
  }

  /**
   * Get doctor's patients
   */
  @Get('patients')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async getDoctorPatients(@Query('doctorId') doctorId: string) {
    const patients = await this.doctorService.getDoctorPatients(doctorId);
    return { patients, total: patients.length };
  }

  /**
   * Get patient medical history
   */
  @Get('patient/:patientId/history')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async getPatientHistory(@Query('patientId') patientId: string) {
    const history = await this.doctorService.getPatientMedicalHistory(patientId);
    return history;
  }

  /**
   * Get patient active prescriptions
   */
  @Get('patient/:patientId/prescriptions')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async getPatientPrescriptions(@Query('patientId') patientId: string) {
    const prescriptions = await this.doctorService.getPatientPrescriptions(patientId);
    return prescriptions;
  }

  /**
   * Update prescription
   */
  @Patch('prescriptions/:prescriptionId')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async updatePrescription(@Query('prescriptionId') prescriptionId: string, @Body() updates: Partial<CreatePrescriptionDto>) {
    const prescription = await this.doctorService.updatePrescription(prescriptionId, updates);
    await this.auditService.logUpdate('DOCTOR', 'doctor@medilink.com', 'doctor', 'Prescription', prescriptionId, updates);
    return prescription;
  }

  @Patch('prescriptions/:prescriptionId/cancel')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async cancelPrescription(@Query('prescriptionId') prescriptionId: string, @Body('reason') reason: string) {
    const prescription = await this.doctorService.cancelPrescription(prescriptionId, reason);
    await this.auditService.logDelete('DOCTOR', 'doctor@medilink.com', 'doctor', 'Prescription', prescriptionId, reason);
    return prescription;
  }

  @Get('stats')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async getStats(@Query('doctorId') doctorId: string) {
    return this.doctorService.getStats(doctorId);
  }

  @Post('refills/:refillId/approve')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async approveRefill(@Query('refillId') refillId: string, @Body('note') note?: string) {
    const refill = await this.doctorService.approveRefillRequest(refillId, note);
    return refill;
  }

  @Post('refills/:refillId/deny')
  @Roles('doctor')
  @HttpCode(HttpStatus.OK)
  async denyRefill(@Query('refillId') refillId: string, @Body('reason') reason: string) {
    const refill = await this.doctorService.denyRefillRequest(refillId, reason);
    return refill;
  }
}
