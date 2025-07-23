import { ApiProperty } from '@nestjs/swagger';
import { User_Role } from '../interfaces/users.interface';

export class UserProfileDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: User_Role })
  role: User_Role;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
