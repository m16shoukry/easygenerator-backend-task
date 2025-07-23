import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import ErrorApiResponse from '../../common/dto/api-response/error-api-response.dto';
import GlobalErrorMessages from '../../common/constants/messages.error';
import { Request } from 'express';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      throw new ErrorApiResponse(GlobalErrorMessages.UNAUTHORIZED);
    }
    if (!request.user) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_EXISTS);
    }
    if (!(request.user as any).is_verified) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_VERIFIED);
    }
    return true;
  }
}
