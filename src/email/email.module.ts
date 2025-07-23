import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

@Global()
@Module({
  providers: [
    {
      provide: 'MAIL_TRANSPORTER',
      useFactory: () => {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      },
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
