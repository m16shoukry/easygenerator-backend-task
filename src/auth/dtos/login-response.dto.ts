import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'jwt.token.here' })
  token: string;

  @ApiProperty({ example: 'shoukry@example.com' })
  email: string;
}
