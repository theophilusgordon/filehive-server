import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty({ message: 'Please add a file' })
  file: Express.Multer.File;
}
