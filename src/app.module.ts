import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { FilesController } from './files/files.controller';
import { FilesService } from './files/files.service';
import { S3Service } from './s3/s3.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [UsersController, AuthController, FilesController],
  providers: [
    PrismaService,
    UsersService,
    AuthService,
    JwtService,
    FilesService,
    S3Service,
  ],
})
export class AppModule {}
