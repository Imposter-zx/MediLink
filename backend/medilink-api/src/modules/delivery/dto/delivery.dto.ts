import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a delivery task
 */
export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  prescriptionId: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsString()
  @IsOptional()
  deliveryInstructions?: string;

  @IsString()
  @IsOptional()
  driverId?: string;

  @IsString()
  @IsOptional()
  priority?: 'routine' | 'urgent' | 'stat';
}

/**
 * DTO for updating delivery status
 */
export class UpdateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

  @IsString()
  @IsOptional()
  eta?: string;

  @IsString()
  @IsOptional()
  currentLocation?: string;
}
