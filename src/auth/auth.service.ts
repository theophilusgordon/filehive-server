import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dtos/sign-in.dto';
import { Authenticated } from './interface/access-token.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { SignUpDto } from './dtos/sign-up.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<Authenticated> {
    const user = await this.validateUser(signInDto);
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '4h',
        secret: jwtConstants.secret,
      }),
      id: user.id,
      role: user.role,
    };
  }

  async signUp(createUserDto: SignUpDto) {
    const {
      email,
      password,
      confirmPassword,
      profilePhoto,
      firstName,
      lastName,
      otherNames,
    } = createUserDto;

    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error(`User with email: ${email} already exists`);
    }

    const hashedPassword = await this.hashPassword(password, confirmPassword);

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        profilePhoto,
        firstName,
        lastName,
        otherNames,
      },
    });

    return this.signIn({ email: user.email, password });
  }

  async forgotPassword(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error(`User with email: ${email} not found`);
    }

    return user;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password, confirmPassword } = resetPasswordDto;

    const { sub: id } = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(`Invalid token`);
    }

    const hashedPassword = await this.hashPassword(password, confirmPassword);

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return this.signIn({ email: updatedUser.email, password });
  }

  private async validateUser(signInDto: SignInDto): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });

    if (!user || !(await bcrypt.compare(signInDto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  private async hashPassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
