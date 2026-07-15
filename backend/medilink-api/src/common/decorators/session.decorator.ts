import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Session decorator to extract session data from request
 * Usage: @Session() session: SessionData
 */
export const Session = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
