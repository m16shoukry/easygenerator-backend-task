import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import ErrorApiResponse from '../../common/dto/api-response/error-api-response.dto';
import GlobalErrorMessages from '../../common/constants/messages.error';
import { Request } from 'express';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // Passport will extract JWT from cookie (see JwtStrategy)
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      throw new ErrorApiResponse(GlobalErrorMessages.UNAUTHORIZED);
    }
    // At this point, request.user should be set by JwtStrategy
    if (!request.user) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_EXISTS);
    }
    if (!(request.user as any).is_verified) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_VERIFIED);
    }
    return true;
  }
}
