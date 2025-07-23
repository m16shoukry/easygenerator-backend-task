import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from './dtos/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hash,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async verifyOtp(
    email: string,
    otp: string,
    redisService: any,
  ): Promise<boolean> {
    const storedOtp = await redisService.getOTP(`otp:${email}`);
    if (storedOtp && storedOtp === otp) {
      await this.userModel.updateOne({ email }, { is_verified: true });
      await redisService.deleteOTP(`otp:${email}`);
      return true;
    }
    return false;
  }

  async getProfileById(id: string): Promise<UserProfileDto | null> {
    const user = await this.userModel.findById(id, '-password').lean();
    if (!user) return null;
    return user as unknown as UserProfileDto;
  }
}
