import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}

  async setOTP(key: string, otp: string, ttlSeconds: number) {
    await this.client.set(key, otp, 'EX', ttlSeconds);
  }

  async getOTP(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async deleteOTP(key: string) {
    await this.client.del(key);
  }
}
