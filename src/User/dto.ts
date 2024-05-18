import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(t: RegisterUserDto) {
    this.username = t.username;
    this.email = t.email;
    this.password = t.password;
  }
}

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  constructor(d: LoginDto) {
    this.email = d.email;
    this.password = d.password;
  }
}
