import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
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
