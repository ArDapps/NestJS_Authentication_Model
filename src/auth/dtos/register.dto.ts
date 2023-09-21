import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class RegisterDto {
  firstName?: string;

  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  password_confirm: string;
}
