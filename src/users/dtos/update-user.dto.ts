import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  otherNames: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  profilePhoto: string;
}
