import { IsOptional } from 'class-validator';

export class UpdateFileDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  file: Express.Multer.File;
}
