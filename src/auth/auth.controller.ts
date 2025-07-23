import { Controller, Post, Body, Res, Req, Get } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiBody, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { SuccessApiResponse } from '../common/dto/api-response/success-api-response.dto';
import { BaseApiResponse } from '../common/dto/api-response/base-api-response.dto';
import { SignupResponseDto } from './dtos/signup-response.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { GlobalSuccessMessages } from '../common/constants/messages.success';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
// import SignupResponseDto, LoginResponseDto, etc. as needed

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BaseApiResponse<LoginResponseDto>> {
    const result = await this.authService.login(loginDto);
    if (result && result.token) {
      res.cookie('access_token', result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
    }
    return new SuccessApiResponse<LoginResponseDto>(
      result,
      GlobalSuccessMessages.LOGIN_SUCCESS,
    );
  }

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseApiResponse<SignupResponseDto>> {
    const newUser = await this.authService.signup(createUserDto);
    return new SuccessApiResponse<SignupResponseDto>(
      newUser,
      GlobalSuccessMessages.EMAIL_SENT,
    );
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend signup OTP' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async resendOtp(
    @Body() dto: ResendOtpDto,
  ): Promise<BaseApiResponse<boolean>> {
    const result = await this.authService.resendOtp(dto.email);
    return new SuccessApiResponse<boolean>(
      result,
      GlobalSuccessMessages.OTP_RESENT,
    );
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify signup OTP' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        otp: { type: 'string' },
      },
    },
  })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BaseApiResponse<LoginResponseDto>> {
    const result = await this.authService.verifyOtp(dto.email, dto.otp);
    if (result) {
      const user = await this.authService.getUserByEmail(dto.email);
      const token = await this.authService.generateJwtForUser(user);
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      return new SuccessApiResponse<LoginResponseDto>(
        { token, email: user.email },
        GlobalSuccessMessages.LOGIN_SUCCESS,
      );
    }
    return new SuccessApiResponse<LoginResponseDto>(
      null,
      GlobalSuccessMessages.EMAIL_VERIFIED,
    );
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: { example: { message: 'Logged out successfully.' } },
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<BaseApiResponse<boolean>> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return new SuccessApiResponse<boolean>(true, 'Logged out successfully.');
  }
}
