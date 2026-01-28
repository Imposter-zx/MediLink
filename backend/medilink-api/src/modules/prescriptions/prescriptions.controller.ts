import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Session } from '../../common/decorators/session.decorator';
import type { SessionData } from '../../common/types/session.types';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionStatusDto,
} from './dto/prescription.dto';

/**
 * Prescriptions Controller
 * Handles medication prescription management
 */
@Controller('prescriptions')
@UseGuards(AuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  /**
   * Create a new prescription (Doctor/Pharmacy only)
   */
  @Post()
  @Roles('doctor', 'pharmacy')
  async create(
    @Body() dto: CreatePrescriptionDto,
    @Session() session: SessionData,
  ) {
    return this.prescriptionsService.create(dto, session.userId);
  }

  /**
   * List prescriptions (filtered by role)
   */
  @Get()
  async list(@Session() session: SessionData, @Query('status') status?: string) {
    if (session.role === 'patient') {
      return this.prescriptionsService.findByPatient(session.userId, status);
    } else if (session.role === 'pharmacy') {
      return this.prescriptionsService.findByPharmacy(
        session.organizationId,
        status,
      );
    }
    return [];
  }

  /**
   * Get a single prescription by ID
   */
  @Get(':id')
  async getById(@Param('id') id: string, @Session() session: SessionData) {
    return this.prescriptionsService.findById(id, session);
  }

  /**
   * Update prescription status (Pharmacy only)
   */
  @Patch(':id/status')
  @Roles('pharmacy')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionStatusDto,
    @Session() session: SessionData,
  ) {
    return this.prescriptionsService.updateStatus(
      id,
      dto.status,
      dto.notes,
      session.userId,
    );
  }
}
