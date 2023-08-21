import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
