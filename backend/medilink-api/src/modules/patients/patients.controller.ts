import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Session } from '../../common/decorators/session.decorator';
import type { SessionData } from '../../common/types/session.types';
import { UpdatePatientDto } from './dto/patient.dto';

/**
 * Patients Controller
 * Handles patient profile management
 */
@Controller('patients')
@UseGuards(AuthGuard, RolesGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  /**
   * Get patient profile
   */
  @Get(':id')
  @Roles('patient', 'pharmacy', 'doctor')
  async getProfile(@Param('id') id: string, @Session() session: SessionData) {
    return this.patientsService.getProfile(id, session);
  }

  /**
   * Update patient profile (Patient only)
   */
  @Patch(':id')
  @Roles('patient')
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @Session() session: SessionData,
  ) {
    // Ensure patient can only update their own profile
    if (id !== session.userId) {
      throw new Error('Cannot update other patient profiles');
    }
    return this.patientsService.updateProfile(id, dto);
  }
}
