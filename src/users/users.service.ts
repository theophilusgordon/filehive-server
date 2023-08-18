import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, profilePhoto, firstName, lastName, otherNames } =
      createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        profilePhoto,
        firstName,
        lastName,
        otherNames,
      },
      select: {
        id: true,
        email: true,
        profilePhoto: true,
        firstName: true,
        lastName: true,
        otherNames: true,
      },
    });
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        profilePhoto: true,
        firstName: true,
        lastName: true,
        otherNames: true,
      },
    });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        profilePhoto: true,
        firstName: true,
        lastName: true,
        otherNames: true,
      },
    });
    return users;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { profilePhoto, firstName, lastName, otherNames, password } =
      updateUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        profilePhoto,
        firstName,
        lastName,
        otherNames,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        profilePhoto: true,
        firstName: true,
        lastName: true,
        otherNames: true,
      },
    });
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.prismaService.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        profilePhoto: true,
        firstName: true,
        lastName: true,
        otherNames: true,
      },
    });
    return user;
  }
}
