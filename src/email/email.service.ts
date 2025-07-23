import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(
    @Inject('MAIL_TRANSPORTER') private readonly transporter: Transporter,
  ) {}

  async sendSignupOTP(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to: email,
      subject: 'Your signup OTP Code',
      text: `Your OTP code is: ${otp} \n\n This OTP will expire in 5 hours.`,
    });
  }
}
