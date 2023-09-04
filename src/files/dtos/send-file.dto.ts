import { IsNotEmpty } from 'class-validator';

export class SendFileDto {
  @IsNotEmpty()
  readonly email: string;
}
