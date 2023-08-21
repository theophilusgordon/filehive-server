import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dtos/sign-in.dto';
import { AccessTokenWithId } from './interface/access-token.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(signInDto: SignInDto): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });

    if (user && (await bcrypt.compare(user.password, signInDto.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signIn(signInDto: SignInDto): Promise<AccessTokenWithId> {
    const user = await this.validateUser(signInDto);
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '4h',
        secret: jwtConstants.secret,
      }),
      id: user.id,
    };
  }
}
