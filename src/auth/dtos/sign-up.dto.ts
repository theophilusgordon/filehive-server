import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  otherNames: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  profilePhoto: string;

  @IsOptional()
  role: string;
}
