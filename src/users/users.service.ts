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

    if (!user) {
      throw new Error(`User with id: ${id} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        profilePhoto: true,
        firstName: true,
        lastName: true,
        otherNames: true,
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        profilePhoto: true,
        firstName: true,
        lastName: true,
        otherNames: true,
      },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const {
      profilePhoto,
      firstName,
      lastName,
      otherNames,
      password,
      confirmPassword,
    } = updateUserDto;
    const user = await this.userExistsById(id);

    let updatedProfilePhotoUrl = user.profilePhoto;
    if (profilePhoto) {
      updatedProfilePhotoUrl = profilePhoto;
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await this.hashPassword(password, confirmPassword);
    }

    return await this.prismaService.user.update({
      where: { id },
      data: {
        profilePhoto: updatedProfilePhotoUrl,
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
  }

  async deleteUser(id: string) {
    await this.userExistsById(id);

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

  private async userExistsById(id: string) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userExists) {
      throw new Error(`User with id: ${id} not found`);
    }
    return userExists;
  }

  private async hashPassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
