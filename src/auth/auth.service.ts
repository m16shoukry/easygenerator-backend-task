import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { ErrorApiResponse } from '../common/dto/api-response/error-api-response.dto';
import { GlobalErrorMessages } from '../common/constants/messages.error';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupResponseDto } from './dtos/signup-response.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<User | null> {
    const user = this.usersService.findByEmail(username);
    if (user) {
      return user;
    }
    return null;
  }

  async signup(createUserDto: CreateUserDto): Promise<SignupResponseDto> {
    const existing = await this.usersService.findByEmail(createUserDto.email);
    if (existing) {
      throw new ErrorApiResponse(GlobalErrorMessages.EMAIL_ALREADY_EXISTS);
    }
    const user = await this.usersService.createUser(createUserDto);
    const otp = this.generateOtp();
    await this.redisService.setOTP(`otp:${user.email}`, otp, 60 * 60 * 5); // 5 hours
    await this.emailService.sendSignupOTP(user.email, otp);
    return {
      email: user.email,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_EXISTS);
    }
    if (!user.is_verified) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_VERIFIED);
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new ErrorApiResponse(GlobalErrorMessages.INVALID_CREDENTIALS);
    }
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    return {
      token,
      email: user.email,
    };
  }

  async resendOtp(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_EXISTS);
    }
    await this.redisService.deleteOTP(`otp:${user.email}`);
    const otp = this.generateOtp();
    await this.redisService.setOTP(`otp:${user.email}`, otp, 60 * 60 * 5); // 5 hours
    await this.emailService.sendSignupOTP(user.email, otp);
    return true;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new ErrorApiResponse(GlobalErrorMessages.USER_NOT_EXISTS);
    }
    const verified = await this.usersService.verifyOtp(
      email,
      otp,
      this.redisService,
    );
    if (!verified) {
      throw new ErrorApiResponse(GlobalErrorMessages.INVALID_OTP);
    }
    return verified;
  }

  async getUserByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }

  async generateJwtForUser(user: User): Promise<string> {
    const payload = { sub: user._id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
