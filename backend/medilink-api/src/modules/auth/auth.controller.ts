import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import type { AuthService } from './auth.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Session } from '../../common/decorators/session.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { SessionData } from '../../common/types/session.types';

/**
 * Auth Controller - Handles authentication endpoints
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login endpoint (demo implementation)
   * TODO: Replace with OIDC flow
   */
  @Post('login')
  async login(@Body() credentials: { email: string; password: string; role?: string }) {
    return this.authService.login(credentials);
  }

  /**
   * Logout endpoint
   */
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Session() session: SessionData) {
    return this.authService.logout(session.userId);
  }

  /**
   * Get current session
   */
  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@Session() session: SessionData) {
    return session;
  }

  /**
   * Protected endpoint example
   */
  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('patient', 'pharmacy', 'delivery')
  async getProfile(@Session() session: SessionData) {
    return {
      userId: session.userId,
      role: session.role,
      message: 'This is a protected endpoint',
    };
  }
}
