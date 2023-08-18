import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [],
  controllers: [UsersController, AuthController],
  providers: [PrismaService, UsersService, AuthService],
})
export class AppModule {}
