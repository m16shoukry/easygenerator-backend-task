import { SetMetadata } from '@nestjs/common';
import { User_Role } from '../../users/interfaces/users.interface';

export const Roles = (...roles: User_Role[]) => SetMetadata('roles', roles);
