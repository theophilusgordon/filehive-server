import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(user: User, subject: string, template: string, url?: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject,
      template,
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    });
  }
}
