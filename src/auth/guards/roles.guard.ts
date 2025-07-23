import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User_Role } from '../../users/interfaces/users.interface';
import { UsersService } from '../../users/users.service';
import { GlobalErrorMessages } from '../../common/constants/messages.error';
import ErrorApiResponse from 'src/common/dto/api-response/error-api-response.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user?.id) {
      throw new ErrorApiResponse(GlobalErrorMessages.UNAUTHORIZED);
    }

    const roles = this.reflector.getAllAndOverride<User_Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const user = await this.usersService.findById(request.user.id);
    if (!user) {
      throw new ErrorApiResponse(GlobalErrorMessages.UNAUTHORIZED);
    }

    const hasRole = roles.some((role) => user.role.includes(role));
    if (!hasRole) {
      throw new ErrorApiResponse(GlobalErrorMessages.FORBIDDEN);
    }

    return hasRole;
  }
}
