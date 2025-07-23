import { Controller, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
// import { CsrfGuard } from '../auth/guards/csrf.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserProfileDto } from './dtos/user-profile.dto';
import { User_Role } from './interfaces/users.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import SuccessApiResponse from 'src/common/dto/api-response/success-api-response.dto';
import { GlobalSuccessMessages } from 'src/common/constants/messages.success';
import BaseApiResponse from 'src/common/dto/api-response/base-api-response.dto';

@ApiTags('Users')
@ApiCookieAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(User_Role.USER)
  @ApiOperation({ summary: 'Get my profile' })
  @ApiOkResponse({ description: 'User profile', type: UserProfileDto })
  async getProfile(
    @GetUser() user: UserProfileDto,
  ): Promise<BaseApiResponse<UserProfileDto>> {
    return new SuccessApiResponse<UserProfileDto>(
      await this.usersService.getProfileById(user._id),
      GlobalSuccessMessages.USER_PROFILE_FETCHED,
    );
  }
}
