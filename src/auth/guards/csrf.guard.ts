import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const csrfToken =
      request.headers['x-csrf-token'] || request.headers['X-CSRF-Token'];
    if (!csrfToken || typeof csrfToken !== 'string') {
      throw new ForbiddenException('Missing CSRF token in header');
    }
    return true;
  }
}
