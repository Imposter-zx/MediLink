import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator for RBAC
 * Usage: @Roles('patient', 'pharmacy')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
