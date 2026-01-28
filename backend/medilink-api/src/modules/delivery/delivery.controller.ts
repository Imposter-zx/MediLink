import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Session } from '../../common/decorators/session.decorator';
import type { SessionData } from '../../common/types/session.types';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto/delivery.dto';

/**
 * Delivery Controller
 * Handles medication delivery task management
 */
@Controller('deliveries')
@UseGuards(AuthGuard, RolesGuard)
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  /**
   * Create delivery task (Pharmacy only)
   */
  @Post()
  @Roles('pharmacy')
  async create(@Body() dto: CreateDeliveryDto, @Session() session: SessionData) {
    return this.deliveryService.create(dto, session.organizationId);
  }

  /**
   * List deliveries (filtered by role)
   */
  @Get()
  async list(@Session() session: SessionData) {
    if (session.role === 'delivery') {
      return this.deliveryService.findByDriver(session.userId);
    } else if (session.role === 'patient') {
      return this.deliveryService.findByPatient(session.userId);
    } else if (session.role === 'pharmacy') {
      return this.deliveryService.findByPharmacy(session.organizationId);
    }
    return [];
  }

  /**
   * Get delivery by ID
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.deliveryService.findById(id);
  }

  /**
   * Update delivery status (Delivery driver only)
   */
  @Patch(':id')
  @Roles('delivery')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryDto,
    @Session() session: SessionData,
  ) {
    return this.deliveryService.updateStatus(id, dto, session.userId);
  }

  /**
   * Assign delivery to driver (Pharmacy only)
   */
  @Patch(':id/assign')
  @Roles('pharmacy')
  async assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    return this.deliveryService.assignDriver(id, driverId);
  }
}
