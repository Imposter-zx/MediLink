import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthService } from './auth.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Session } from '../../common/decorators/session.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { SessionData } from '../../common/types/session.types';

type RequestWithSession = Request & {
  session: {
    user?: any;
    save: (callback: (err?: unknown) => void) => void;
    destroy: (callback: (err?: unknown) => void) => void;
  };
};

/**
 * Auth Controller - Handles authentication endpoints
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login endpoint
   */
  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string; role?: string },
    @Req() req: RequestWithSession,
  ) {
    const { user } = await this.authService.login(credentials);

    req.session.user = {
      userId: user.id,
      role: user.role,
      organizationId: user.organizationId,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      email: user.email,
      name: user.name,
    };

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return { user };
  }

  /**
   * Logout endpoint
   */
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: RequestWithSession, @Session() session: SessionData) {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.authService.logout(session.userId));
      });
    });
  }

  /**
   * Get current session
   */
  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@Req() req: RequestWithSession) {
    return req.session.user;
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

  @Post('2fa/generate')
  async generateTwoFactor(
    @Req() req: RequestWithSession,
    @Body('email') email?: string,
  ) {
    const requesterEmail =
      email || req.session?.user?.email || 'user@example.com';
    return this.authService.generateTwoFactorSecret(requesterEmail);
  }

  @Post('2fa/verify')
  async verifyTwoFactor(
    @Body() body: { secret: string; token: string },
  ) {
    if (!body.secret || !body.token) {
      throw new UnauthorizedException('Secret and token are required');
    }

    const valid = await this.authService.verifyTokenWithSecret(
      body.secret,
      body.token,
    );

    return { valid };
  }
}
