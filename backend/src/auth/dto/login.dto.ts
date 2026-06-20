import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O email deve ser um endereço válido' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string' })
  password: string;
}
