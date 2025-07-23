import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from 'src/users/dtos/user-profile.dto';

export class AuthResponseDto {
  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;
}
