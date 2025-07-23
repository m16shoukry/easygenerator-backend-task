import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

// @Injectable()
// export class CsrfGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     // Check for CSRF token in custom header
//     const csrfToken =
//       request.headers['x-csrf-token'] || request.headers['X-CSRF-Token'];
//     if (!csrfToken || typeof csrfToken !== 'string') {
//       throw new ForbiddenException('Missing CSRF token in header');
//     }
//     // csurf middleware already validates the token, so just check presence here
//     return true;
//   }
// }
