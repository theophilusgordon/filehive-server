import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { Authenticated } from './interface/access-token.interface';
import { SignUpDto } from './dtos/sign-up.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from './user/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() signUpDto: SignUpDto): Promise<Authenticated> {
    try {
      return await this.authService.signUp(signUpDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto): Promise<Authenticated> {
    try {
      return await this.authService.signIn(signInDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const userWithToken = await this.authService.forgotPassword(
        forgotPasswordDto.email,
      );
      try {
        await this.mailService.sendMail(
          userWithToken.user,
          'Reset Your Password',
          './reset-password',
          `${process.env.CLIENT_HOST}/reset-password/${userWithToken.token}`,
        );
        return {
          message: `A password reset link has been sent to ${userWithToken.user.email}`,
        };
      } catch (error) {
        throw new HttpException(
          'Something went wrong. Please try again later',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(resetPasswordDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
