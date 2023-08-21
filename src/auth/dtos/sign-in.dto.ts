import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}
