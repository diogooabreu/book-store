import { IsInt, IsISBN, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'O título deve ser uma string' })
  @MinLength(1, { message: 'O título não pode estar vazio' })
  title: string;

  @IsString({ message: 'O ISBN deve ser uma string' })
  @IsISBN(undefined, { message: 'O ISBN informado não é válido' })
  isbn: string;

  @IsInt({ message: 'O estoque deve ser um número inteiro' })
  @Min(0, { message: 'O estoque não pode ser negativo' })
  stock: number;

  @IsString({ message: 'O authorId deve ser uma string' })
  @IsUUID('4', { message: 'O authorId deve ser um UUID válido' })
  authorId: string;
}
