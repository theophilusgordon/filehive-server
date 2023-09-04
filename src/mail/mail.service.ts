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

  async sendMailWithAttachment(
    email: string,
    subject: string,
    template: string,
    fileStream: any,
    fileName: string,
    sender: User,
    recipient: User,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        sender: `${sender.firstName} ${sender.lastName}`,
        recipient: `${recipient.firstName} ${recipient.lastName}`,
      },
      attachments: [
        {
          filename: `${fileName}.pdf`,
          content: fileStream,
        },
      ],
    });

    return { message: 'Email sent with attachment successfully' };
  }
  catch(error: never) {
    throw new Error(error);
  }
}
