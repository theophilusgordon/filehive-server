import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

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
    const { profilePhoto, firstName, lastName, otherNames } = updateUserDto;
    const user = await this.userExistsById(id);

    let updatedProfilePhotoUrl = user.profilePhoto;
    if (profilePhoto) {
      updatedProfilePhotoUrl = profilePhoto;
    }

    return await this.prismaService.user.update({
      where: { id },
      data: {
        profilePhoto: updatedProfilePhotoUrl,
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
}
