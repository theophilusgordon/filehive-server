import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Exclude()
  password: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  otherNames: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  profilePhoto: string;
}
