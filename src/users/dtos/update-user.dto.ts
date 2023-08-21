import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  password: string;

  @IsOptional()
  confirmPassword: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  otherNames: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  profilePhoto: string;
}
