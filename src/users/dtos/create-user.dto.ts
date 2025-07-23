import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { User_Role } from '../interfaces/users.interface';

export class CreateUserDto {
  @ApiProperty({ example: 'Shoukry' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required!' })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The email of the user',
    example: 'shoukry@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required!' })
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Password@123',
    description:
      'Minimum 8 characters, at least one letter, one number, and one special character.',
  })
  @IsString()
  @MinLength(8, { message: 'Minimum 8 characters!' })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  @IsOptional()
  @IsEnum(User_Role, { message: 'Role must be either user or admin' })
  @ApiProperty({
    type: String,
    required: false,
    enum: User_Role,
    description: 'The role of the account',
    default: User_Role.USER,
  })
  role?: User_Role;
}
