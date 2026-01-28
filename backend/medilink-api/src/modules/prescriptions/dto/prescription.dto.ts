import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a prescription
 */
export class CreatePrescriptionDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  medicationName: string;

  @IsString()
  @IsNotEmpty()
  medicationCode: string;

  @IsString()
  @IsNotEmpty()
  dosageInstructions: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  frequency: number;

  @IsNumber()
  @IsOptional()
  refills?: number;

  @IsString()
  @IsOptional()
  pharmacyId?: string;
}

/**
 * DTO for updating prescription status
 */
export class UpdatePrescriptionStatusDto {
  @IsString()
  @IsNotEmpty()
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';

  @IsString()
  @IsOptional()
  notes?: string;
}
