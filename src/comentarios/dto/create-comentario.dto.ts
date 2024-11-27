import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  @IsString()
  reqServicoId: string;

  @IsNotEmpty()
  @IsString()
  comentario: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Avaliação não pode ser menor que 1' })
  @Max(5, { message: 'Avaliação não pode ser maior que 5' })
  rating: number;
}
